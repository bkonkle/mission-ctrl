import {expect} from 'chai'
import {fromJS} from 'immutable'
import {GOAL_TRANSPILE} from 'state/foreman'
import {inProgress} from 'workers/transpiler/state'
import {mockStore} from 'utils/test'
import {workerBusy, workerReady, WORKER_TRANSPILER} from 'workers/state'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('workers/transpiler', () => {
  const dispatchSpy = sinon.spy()
  const globStub = sinon.stub().returns(['src/spike.js', 'src/lee.js'])
  const subscribeSpy = sinon.spy()
  const transpileSpy = sinon.spy()

  const transpiler = proxyquire('./index', {
    'glob': {sync: globStub},
    'state/store': {getStore: () => ({
      dispatch: dispatchSpy,
      subscribe: subscribeSpy,
    })},
    'utils/babel': {transpileToDir: transpileSpy},
  })

  afterEach(() => {
    dispatchSpy.reset()
    globStub.reset()
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
      expect(process.send).to.have.been.calledWith(workerReady(WORKER_TRANSPILER))
    })

  })

  describe('transpile()', () => {

    it('reports status to the worker and updates internal status', done => {
      const expectedActions = [inProgress(true), inProgress(false)]
      const store = mockStore({}, expectedActions, done)

      transpiler.transpile(store)

      expect(process.send).to.have.been.calledWith(workerBusy(WORKER_TRANSPILER))
      expect(process.send).to.have.been.calledWith(workerReady(WORKER_TRANSPILER))
    })

    it('calls transpileToDir with the appropriate arguments', done => {
      const expectedActions = [inProgress(true), inProgress(false)]
      const store = mockStore({}, expectedActions, done)

      transpiler.transpile(store)

      expect(transpileSpy).to.have.been.calledWith({
        baseDir: 'src',
        filenames: ['src/spike.js', 'src/lee.js'],
        outDir: 'build',
        sourceMaps: true,
      })
    })

  })

  describe('stateChanged()', () => {

    describe('GOAL_TRANSPILE', () => {

      it('runs a transpile', () => {
        const store = {
          dispatch: () => {},
          getState: () => ({
            transpiler: fromJS({goal: GOAL_TRANSPILE, inProgress: false}),
          }),
        }

        transpiler.stateChanged(store)

        expect(transpileSpy).to.have.been.calledOnce
      })

    })

  })

})
