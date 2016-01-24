import {busy, ready, WORKER_TRANSPILER} from 'state/workers'
import {expect} from 'chai'
import {fromJS} from 'immutable'
import {mockStore} from 'utils/test'
import {started, finish, STATUS_STARTING} from 'state/transpiler'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('workers/transpiler', () => {
  const dispatchSpy = sinon.spy()
  const subscribeSpy = sinon.spy()
  const transpileSpy = sinon.spy()

  const transpiler = proxyquire('./transpiler', {
    'state/store': {getStore: () => ({
      dispatch: dispatchSpy,
      subscribe: subscribeSpy,
    })},
    'utils/babel': {transpileToDir: transpileSpy},
  })

  afterEach(() => {
    dispatchSpy.reset()
    subscribeSpy.reset()
    transpileSpy.reset()
    process.on.reset()
    process.send.reset()
  })

  describe('init', () => {

    it('subscribes to state changes', () => {
      transpiler.init()
      expect(subscribeSpy).to.have.been.calledOnceÎ
    })

    it('dispatches actions from parent process messages', () => {
      const message = 'Test message'

      transpiler.init()

      expect(process.on).to.have.been.calledOnce

      const callback = process.on.firstCall.args[1]
      callback(message)

      expect(dispatchSpy).to.have.been.calledWith(message)
    })

    it('sends a ready message back to the parent process', () => {
      transpiler.init()
      expect(process.send).to.have.been.calledWith(ready(WORKER_TRANSPILER))
    })

  })

  describe('transpile()', () => {

    it('reports status to the worker and updates internal status', done => {
      const expectedActions = [started(), finish()]
      const store = mockStore({}, expectedActions, done)

      transpiler.transpile(store)

      expect(process.send).to.have.been.calledWith(busy(WORKER_TRANSPILER))
      expect(process.send).to.have.been.calledWith(ready(WORKER_TRANSPILER))
    })

  })

  describe('stateChanged()', () => {

    describe('STATUS_STARTING', () => {

      it('runs a transpile', () => {
        const store = {
          dispatch: () => {},
          getState: () => ({
            transpiler: fromJS({status: STATUS_STARTING}),
          }),
        }

        transpiler.stateChanged(store)

        expect(transpileSpy).to.have.been.calledOnce
      })

      it('dispatches a STARTED event', done => {
        const initialState = {transpiler: fromJS({status: STATUS_STARTING})}
        const expectedActions = [started(), finish()]
        const store = mockStore(initialState, expectedActions, done)

        transpiler.stateChanged(store)

        expect(transpileSpy).to.have.been.calledOnce
      })

    })

  })

})
