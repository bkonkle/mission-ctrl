import {expect} from 'chai'
import {mockStore} from 'utils/test'
import {busy, ready, WORKER_TRANSPILER} from 'state/workers'
import {start, finish} from 'state/transpiler'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('workers/transpiler', () => {

  const transpileSpy = sinon.spy()

  const transpiler = proxyquire('workers/transpiler', {
    'utils/babel': {transpileToDir: transpileSpy},
  })

  afterEach(() => {
    transpileSpy.reset()
  })

  describe('transpile()', () => {

    it('reports status to the worker and updates internal status', done => {
      const expectedActions = [start(), finish()]
      const store = mockStore({}, expectedActions, done)
      const worker = {postMessage: sinon.spy()}

      transpiler.transpile(store, worker)

      expect(worker.postMessage).to.have.been.calledWith(busy(WORKER_TRANSPILER))
      expect(worker.postMessage).to.have.been.calledWith(ready(WORKER_TRANSPILER))
    })

  })

})
