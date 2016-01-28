import {expect} from 'chai'
import {fromJS} from 'immutable'
import {mockStore} from 'utils/test'
import {setGoal as setLinterGoal} from 'workers/linter/state'
import {setGoal as setTranspilerGoal} from 'workers/transpiler/state'
import {setGoal as setWatcherGoal} from 'workers/watcher/state'
import * as foremanState from 'state/foreman'
import * as workers from 'state/workers'
import path from 'path'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('foreman', () => {

  const forkStub = sinon.stub()

  const foreman = proxyquire('./foreman', {
    'child_process': {fork: forkStub},
  })

  beforeEach(() => {
    forkStub.reset()
  })

  describe('init()', () => {

    let callback

    before(() => {
      forkStub.returns({
        on: (event, cb) => {
          callback = cb
        },
      })
    })

    it('spawns a transpiler worker', () => {
      foreman.init()
      expect(forkStub).to.have.been.calledWith(require.resolve('workers/transpiler'))
    })

    it('dispatches actions from worker messages', done => {
      const store = mockStore({}, [
        foremanState.setGoal(foremanState.GOAL_WATCH),
        workers.workerReady(workers.WORKER_WATCHER),
      ], done)
      store.subscribe = () => {}

      foreman.init(store)

      callback(workers.workerReady(workers.WORKER_WATCHER))
    })

    it('subscribes to state changes', done => {
      const store = mockStore({}, [
        foremanState.setGoal(foremanState.GOAL_WATCH),
      ], done)

      store.subscribe = sinon.spy()

      foreman.init(store)

      expect(store.subscribe).to.have.been.calledOnce
      expect(store.subscribe.firstCall.args[0]).to.have.property('name', 'bound stateChanged')
    })

    it('dispatches an initial GOAL_WATCH', done => {
      const store = mockStore({}, [
        foremanState.setGoal(foremanState.GOAL_WATCH),
      ], done)
      store.subscribe = () => {}

      foreman.init(store)
    })

  })

  describe('forkWorker()', () => {

    it('calls child_process.fork on the requested worker', () => {
      const worker = {}
      const workerName = 'whip-creamer'
      const workerPath = path.resolve(
        path.join(__dirname, 'workers', `${workerName}/index.js`)
      )
      forkStub.returns(worker)

      const result = foreman.forkWorker(workerName)

      expect(forkStub).to.be.calledWith(workerPath)
      expect(result).to.equal(worker)
    })

  })

  describe('stateChanged()', () => {

    it('throws an error if there is no goal', () => {
      const sendSpy = sinon.spy()
      const store = {getState: () => ({foreman: fromJS({goal: null})})}
      const processes = {[workers.WORKER_TRANSPILER]: {send: sendSpy}}

      expect(
        () => foreman.stateChanged(store, processes)
      ).to.throw(Error)
    })

    describe('GOAL_WATCH', () => {

      it('starts a watcher', () => {
        const dispatchSpy = sinon.spy()
        const sendSpy = sinon.spy()
        const store = {
          dispatch: dispatchSpy,
          getState: () => ({
            foreman: fromJS({goal: foremanState.GOAL_WATCH}),
            workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.READY}}),
          }),
        }
        const processes = {[workers.WORKER_WATCHER]: {send: sendSpy}}

        foreman.stateChanged(store, processes)

        expect(dispatchSpy).to.be.calledWith(workers.workerBusy(workers.WORKER_WATCHER))
        expect(sendSpy).to.be.calledWith(setWatcherGoal(foremanState.GOAL_WATCH))
      })

      it('starts transpiling if the watcher is ready', () => {
        const dispatchSpy = sinon.spy()
        const store = {
          dispatch: dispatchSpy,
          getState: () => ({
            foreman: fromJS({goal: foremanState.GOAL_WATCH}),
            workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.DONE}}),
          }),
        }
        const processes = {[workers.WORKER_WATCHER]: {send: () => {}}}

        foreman.stateChanged(store, processes)

        expect(dispatchSpy).to.be.calledWith(foremanState.setGoal(foremanState.GOAL_TRANSPILE))
      })

    })

    describe('GOAL_TRANSPILE', () => {

      it('starts transpilation', () => {
        const dispatchSpy = sinon.spy()
        const sendSpy = sinon.spy()
        const store = {
          dispatch: dispatchSpy,
          getState: () => ({
            foreman: fromJS({goal: foremanState.GOAL_TRANSPILE}),
            workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.READY}}),
          }),
        }
        const processes = {[workers.WORKER_TRANSPILER]: {send: sendSpy}}

        foreman.stateChanged(store, processes)

        expect(dispatchSpy).to.be.calledWith(workers.workerBusy(workers.WORKER_TRANSPILER))
        expect(sendSpy).to.be.calledWith(setTranspilerGoal(foremanState.GOAL_TRANSPILE))
      })

      it('starts linting if transpilation is done', () => {
        const dispatchSpy = sinon.spy()
        const store = {
          dispatch: dispatchSpy,
          getState: () => ({
            foreman: fromJS({goal: foremanState.GOAL_TRANSPILE}),
            workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.DONE}}),
          }),
        }
        const processes = {[workers.WORKER_TRANSPILER]: {send: () => {}}}

        foreman.stateChanged(store, processes)

        expect(dispatchSpy).to.be.calledWith(foremanState.setGoal(foremanState.GOAL_LINT))
      })

      it('sets the transpiler as ready if transpilation is done', () => {
        const dispatchSpy = sinon.spy()
        const store = {
          dispatch: dispatchSpy,
          getState: () => ({
            foreman: fromJS({goal: foremanState.GOAL_TRANSPILE}),
            workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.DONE}}),
          }),
        }
        const processes = {[workers.WORKER_TRANSPILER]: {send: () => {}}}

        foreman.stateChanged(store, processes)

        expect(dispatchSpy).to.be.calledWith(workers.workerReady(workers.WORKER_TRANSPILER))
      })

    })

    describe('GOAL_LINT', () => {

      it('starts linting', () => {
        const dispatchSpy = sinon.spy()
        const sendSpy = sinon.spy()
        const store = {
          dispatch: dispatchSpy,
          getState: () => ({
            foreman: fromJS({goal: foremanState.GOAL_LINT}),
            workers: fromJS({[workers.WORKER_LINTER]: {status: workers.READY}}),
          }),
        }
        const processes = {[workers.WORKER_LINTER]: {send: sendSpy}}

        foreman.stateChanged(store, processes)

        expect(dispatchSpy).to.be.calledWith(workers.workerBusy(workers.WORKER_LINTER))
        expect(sendSpy).to.be.calledWith(setLinterGoal(foremanState.GOAL_LINT))
      })

      it('starts testing if transpilation is done', () => {
        const dispatchSpy = sinon.spy()
        const store = {
          dispatch: dispatchSpy,
          getState: () => ({
            foreman: fromJS({goal: foremanState.GOAL_LINT}),
            workers: fromJS({[workers.WORKER_LINTER]: {status: workers.DONE}}),
          }),
        }
        const processes = {[workers.WORKER_LINTER]: {send: () => {}}}

        foreman.stateChanged(store, processes)

        expect(dispatchSpy).to.be.calledWith(foremanState.setGoal(foremanState.GOAL_TEST))
      })

    })

  })

})
