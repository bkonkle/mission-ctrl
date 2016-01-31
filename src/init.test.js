import {expect} from 'chai'
import {WORKER_LINTER, WORKER_TRANSPILER, WORKER_WATCHER} from 'state/workers'
import proxyquire from 'proxyquire'
import initLinter from 'sagas/linter'
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

  describe('init()', () => {

    it('defaults to initializing the foreman state', () => {
      init()
      expect(newStore).to.have.been.calledWith(startForeman)
    })

    it('initializes the watcher', () => {
      init(WORKER_WATCHER)
      expect(workerInit).to.have.been.calledWith(WORKER_WATCHER)
    })

    it('initializes the transpiler', () => {
      init(WORKER_TRANSPILER)
      expect(workerInit).to.have.been.calledWith(WORKER_TRANSPILER)
    })

    it('initializes the linter', () => {
      init(WORKER_LINTER)
      expect(workerInit).to.have.been.calledWith(WORKER_LINTER, initLinter)
    })

  })

})
