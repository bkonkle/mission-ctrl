import {expect} from 'chai'
import * as workers from 'state/workers'
import initLinter from 'sagas/linter'
import initTestRunner from 'sagas/test-runner'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import startForeman from 'sagas/foreman'

describe('init', () => {
  const newStore = sinon.stub()
  const workerInit = sinon.stub()

  const init = proxyquire('./init', {
    'state/store': {newStore},
    'utils/workers': {workerInit},
  })

  beforeEach(() => {
    newStore.reset()
    workerInit.reset()
  })

  describe('initForeman', () => {

    it('initializing the foreman state', () => {
      init.initForeman()
      expect(newStore).to.have.been.calledWith(startForeman)
    })

  })

  describe('initWorker()', () => {

    it('initializes the watcher', () => {
      init.initWorker(workers.WORKER_WATCHER)
      expect(workerInit).to.have.been.calledWith(workers.WORKER_WATCHER)
    })

    it('initializes the transpiler', () => {
      init.initWorker(workers.WORKER_TRANSPILER)
      expect(workerInit).to.have.been.calledWith(workers.WORKER_TRANSPILER)
    })

    it('initializes the linter', () => {
      init.initWorker(workers.WORKER_LINTER)
      expect(workerInit).to.have.been.calledWith(workers.WORKER_LINTER, initLinter)
    })

    it('initializes the test runner', () => {
      init.initWorker(workers.WORKER_TEST_RUNNER)
      expect(workerInit).to.have.been.calledWith(workers.WORKER_TEST_RUNNER, initTestRunner)
    })

  })

})
