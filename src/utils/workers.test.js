import {expect} from 'chai'
import {WORKER_TRANSPILER, workerReady} from 'state/workers'
import path from 'path'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/workers', () => {
  const dispatchSpy = sinon.spy()
  const forkStub = sinon.stub()
  const subscribeSpy = sinon.spy()
  const mockStore = {dispatch: dispatchSpy, subscribe: subscribeSpy}
  const origPath = process.env.NODE_PATH

  const workers = proxyquire('./workers', {
    'child_process': {fork: forkStub},
    'state/store': {getStore: () => mockStore},
  })

  beforeEach(() => {
    dispatchSpy.reset()
    forkStub.reset()
    subscribeSpy.reset()
    process.on.reset()
    process.send.reset()
  })

  afterEach(() => {
    process.env.NODE_PATH = origPath
  })

  describe('workerInit()', () => {

    it('dispatches actions from parent process messages', () => {
      const callback = sinon.spy()
      const message = {type: 'ship-yard/utils/TEST'}

      workers.workerInit(WORKER_TRANSPILER, callback)()

      expect(process.on).to.have.been.calledOnce
      const cb = process.on.firstCall.args[1]
      cb(message)

      expect(dispatchSpy).to.have.been.calledWith(message)
    })

    it('sends a ready message back to the parent process', () => {
      workers.workerInit(WORKER_TRANSPILER, () => {})()
      expect(process.send).to.have.been.calledWith(workerReady(WORKER_TRANSPILER))
    })

    it('adds the node_modules of the source to the node path', () => {
      workers.workerInit(WORKER_TRANSPILER, () => {})()
      expect(process.env.NODE_PATH).to.include(path.resolve('node_modules'))
    })

  })

  describe('forkWorker()', () => {

    it('calls child_process.fork on the requested worker', () => {
      const worker = {}
      const workerName = 'whip-creamer'
      const workerPath = path.resolve(
        path.join(path.dirname(__dirname), 'workers', `${workerName}.js`)
      )
      forkStub.returns(worker)

      const result = workers.forkWorker(workerName)

      expect(forkStub).to.be.calledWith(workerPath)
      expect(result).to.equal(worker)
    })

  })

})
