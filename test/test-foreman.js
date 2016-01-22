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

    it('spawns a transpiler worker', () => {
      init()
      expect(threadStub.Worker).to.have.been.called
    })

    it('messages from the workers dispatch actions', done => {
      const worker = {}
      threadStub.Worker.returns(worker)
      const store = mockStore({}, [ready('transpiler')], done)

      init(store)

      worker.onmessage(ready('transpiler'))
    })

  })

})
