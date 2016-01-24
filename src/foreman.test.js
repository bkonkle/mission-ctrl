import {expect} from 'chai'
import {fromJS} from 'immutable'
import {mockStore} from 'utils/test'
import {ready, STATUS_READY, WORKER_TRANSPILER} from 'state/workers'
import {setGoal, GOAL_TRANSPILE} from 'state/foreman'
import {start as startTranspiler} from 'state/transpiler'
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
        ready('transpiler'),
      ], done)
      store.subscribe = () => {}

      foreman.init(store)

      callback(ready('transpiler'))
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
      const workers = {[WORKER_TRANSPILER]: {send: sendSpy}}

      expect(
        () => foreman.stateChanged(store, workers)
      ).to.throw(Error)
    })

    it('starts transpilation if that is the goal', () => {
      const sendSpy = sinon.spy()
      const store = {getState: () => ({
        foreman: fromJS({goal: GOAL_TRANSPILE}),
        workers: fromJS({[WORKER_TRANSPILER]: {status: STATUS_READY}}),
      })}
      const workers = {[WORKER_TRANSPILER]: {send: sendSpy}}

      foreman.stateChanged(store, workers)

      expect(sendSpy).to.be.calledWith(startTranspiler())
    })

  })

})
