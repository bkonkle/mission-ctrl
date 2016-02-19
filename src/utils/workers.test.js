import {expect} from 'chai'
import {WORKER_TRANSPILER, WORKER_WATCHER, workerReady} from 'state/workers'
import path from 'path'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/workers', () => {
  const forkStub = sinon.stub()
  const origPath = process.env.NODE_PATH

  const workers = proxyquire('./workers', {
    'child_process': {fork: forkStub},
  })

  before(() => {
    sinon.spy(process, 'on')
    sinon.spy(process, 'send')
  })

  beforeEach(() => {
    forkStub.reset()
    process.on.reset()
    process.send.reset()
  })

  afterEach(() => {
    process.env.NODE_PATH = origPath
  })

  after(() => {
    process.on.restore()
    process.send.restore()
  })

  describe('forkWorker()', () => {

    it('calls child_process.fork on the requested worker', () => {
      const worker = {}
      const workerId = WORKER_WATCHER
      const config = {tmpDir: '/tmp/mission-ctrl-test'}
      const args = [
        workerId,
        ...process.argv.slice(2),
        '--color',
        '--tmpDir',
        config.tmpDir,
      ]
      const workerPath = path.resolve(
        path.join(path.dirname(__dirname), 'init.js')
      )
      forkStub.returns(worker)

      const result = workers.forkWorker(workerId, config)

      expect(forkStub).to.be.calledWith(workerPath, args)
      expect(result).to.equal(worker)
    })

  })

  describe('workerInit()', () => {

    it('dispatches actions from parent process messages', () => {
      const saga = function* mockSaga() {}
      const dispatch = sinon.spy()
      const store = {dispatch}
      const message = {type: 'mission-ctrl/utils/TEST'}

      workers.workerInit(WORKER_TRANSPILER, saga, store)

      expect(process.on).to.have.been.calledOnce
      const cb = process.on.firstCall.args[1]
      cb(message)

      expect(dispatch).to.have.been.calledWith(message)
    })

    it('sends a ready message back to the parent process', () => {
      const saga = function* mockSaga() {}
      workers.workerInit(WORKER_TRANSPILER, saga)
      expect(process.send).to.have.been.calledWith(workerReady(WORKER_TRANSPILER))
    })

    it('adds the node_modules of the source to the node path', () => {
      const saga = function* mockSaga() {}
      workers.workerInit(WORKER_TRANSPILER, saga)
      expect(process.env.NODE_PATH).to.include(path.resolve('node_modules'))
    })

  })

  describe('streams', () => {

    it('returns a through stream for each worker', () => {
      const processes = ['watcher', 'transpiler', 'linter', 'test-runner',
                         'bundler', 'dev-server']
      expect(workers.streams).to.include.keys(processes)
      processes.forEach(proc => {
        const stream = workers.streams.get(proc)
        expect(stream).to.have.property('readable', true)
        expect(stream).to.have.property('writable', true)
      })
    })

  })

})
