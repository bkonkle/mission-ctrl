import {expect} from 'chai'
import {mockStore} from 'utils/test'
import {ready} from 'state/workers'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('foreman', () => {

  const threadStub = {Worker: sinon.stub().returns({})}

  const {init} = proxyquire('foreman', {
    'webworker-threads': threadStub,
  })

  afterEach(() => {
    threadStub.Worker.reset()
  })

  describe('init()', () => {

    it('spawns a compiler worker', () => {
      init()
      expect(threadStub.Worker).to.have.been.called
    })

    it('messages from the workers dispatch actions', done => {
      const worker = {}
      threadStub.Worker.returns(worker)
      const store = mockStore({}, [ready('compiler')], done)

      init(store)

      worker.onmessage(ready('compiler'))
    })

  })

})
