import {expect} from 'chai'
import {streams} from 'utils/workers'
import {WORKER_LINTER, WORKER_TRANSPILER, WORKER_WATCHER} from 'state/workers'
import initLinter from 'sagas/linter'
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

  describe('init()', () => {

    it('defaults to initializing the foreman state and returning the streams', () => {
      const result = init()
      expect(newStore).to.have.been.calledWith(startForeman)
      expect(result).to.equal(streams)
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
