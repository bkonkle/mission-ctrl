import {expect} from 'chai'
import {fromJS} from 'immutable'
import {mockStore} from 'utils/test'
import {setGoal as setLinterGoal} from 'state/linter'
import {setGoal as setTranspilerGoal} from 'state/transpiler'
import {setGoal, GOAL_TRANSPILE, GOAL_LINT} from 'state/foreman'
import * as workers from 'state/workers'
import path from 'path'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('foreman', () => {

  const forkStub = sinon.stub()

  const foreman = proxyquire('./foreman', {
    'child_process': {fork: forkStub},
  })

  afterEach(() => {
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
        setGoal(GOAL_TRANSPILE),
        workers.workerReady('transpiler'),
      ], done)
      store.subscribe = () => {}

      foreman.init(store)

      callback(workers.workerReady('transpiler'))
    })

    it('subscribes to state changes', done => {
      const store = mockStore({}, [
        setGoal(GOAL_TRANSPILE),
      ], done)

      store.subscribe = sinon.spy()

      foreman.init(store)

      expect(store.subscribe).to.have.been.calledOnce
      expect(store.subscribe.firstCall.args[0]).to.have.property('name', 'bound stateChanged')
    })

    it('dispatches an initial GOAL_TRANSPILE', done => {
      const store = mockStore({}, [
        setGoal(GOAL_TRANSPILE),
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
        path.join(__dirname, 'workers', `${workerName}.js`)
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

    it('starts transpilation if that is the goal', () => {
      const sendSpy = sinon.spy()
      const store = {getState: () => ({
        foreman: fromJS({goal: GOAL_TRANSPILE}),
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.READY}}),
      })}
      const processes = {[workers.WORKER_TRANSPILER]: {send: sendSpy}}

      foreman.stateChanged(store, processes)

      expect(sendSpy).to.be.calledWith(setTranspilerGoal(GOAL_TRANSPILE))
    })

    it('starts linting if transpilation is done', () => {
      const sendSpy = sinon.spy()
      const store = {getState: () => ({
        foreman: fromJS({goal: GOAL_LINT}),
        workers: fromJS({[workers.WORKER_LINTER]: {status: workers.READY}}),
      })}
      const processes = {[workers.WORKER_LINTER]: {send: sendSpy}}

      foreman.stateChanged(store, processes)

      expect(sendSpy).to.be.calledWith(setLinterGoal(GOAL_LINT))
    })

  })

})
