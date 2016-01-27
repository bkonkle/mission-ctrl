import {expect} from 'chai'
import {WORKER_TRANSPILER, workerReady} from 'state/workers'
import path from 'path'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/workers', () => {

  const dispatchSpy = sinon.spy()
  const subscribeSpy = sinon.spy()
  const mockStore = {dispatch: dispatchSpy, subscribe: subscribeSpy}

  const testUtils = proxyquire('./utils', {
    'state/store': {getStore: () => mockStore},
  })

  beforeEach(() => {
    dispatchSpy.reset()
    subscribeSpy.reset()
    process.on.reset()
    process.send.reset()
  })

  describe('workerInit()', () => {

    it('subscribes to state changes', () => {
      const callback = sinon.spy()
      testUtils.workerInit(WORKER_TRANSPILER, callback)()
      expect(subscribeSpy).to.have.been.calledOnce
    })

    it('dispatches actions from parent process messages', () => {
      const callback = sinon.spy()
      const message = {type: 'ship-yard/utils/TEST'}

      testUtils.workerInit(WORKER_TRANSPILER, callback)()

      expect(process.on).to.have.been.calledOnce
      const cb = process.on.firstCall.args[1]
      cb(message)

      expect(dispatchSpy).to.have.been.calledWith(message)
    })

    it('sends a ready message back to the parent process', () => {
      testUtils.workerInit(WORKER_TRANSPILER, () => {})()
      expect(process.send).to.have.been.calledWith(workerReady(WORKER_TRANSPILER))
    })

    it('adds the node_modules of the source to the node path', () => {
      testUtils.workerInit(WORKER_TRANSPILER, () => {})()
      expect(process.env.NODE_PATH).to.include(path.resolve('node_modules'))
    })

  })

})
