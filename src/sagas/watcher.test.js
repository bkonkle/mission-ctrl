import {expect} from 'chai'
import {GOAL_WATCH} from 'state/foreman'
import {WORKER_WATCHER} from 'state/workers'
import {startProcess} from 'utils/sagas'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('sagas/watcher', () => {
  const startStub = sinon.stub().returns(startProcess(WORKER_WATCHER, GOAL_WATCH))

  const watcher = proxyquire('./watcher', {
    'utils/sagas': {startProcess: startStub},
  })

  afterEach(() => {
    startStub.reset()
  })

  describe('watcher()', () => {

    it('passes a worker id and exports the saga that is returned', () => {
      watcher()
      expect(startStub).to.have.been.calledWith(WORKER_WATCHER, GOAL_WATCH)
    })

  })

})
