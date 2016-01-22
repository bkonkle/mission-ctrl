import {expect} from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('foreman', () => {

  const threadStub = {Worker: sinon.stub().returns({})}

  const {init} = proxyquire('../src/foreman', {
    'webworker-threads': threadStub,
  })

  describe('init()', () => {

    it('spawns a compiler worker', () => {
      init()
      expect(threadStub.Worker).to.have.been.called
    })

  })

})
