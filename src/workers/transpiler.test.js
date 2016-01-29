import {expect} from 'chai'
import {inProgress} from 'state/transpiler'
import {mockStore} from 'utils/test'
import {workerDone, WORKER_TRANSPILER} from 'state/workers'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('workers/transpiler', () => {
  const dispatchSpy = sinon.spy()
  const globStub = sinon.stub()
  const initSpy = sinon.spy()
  const subscribeSpy = sinon.spy()
  const transpileSpy = sinon.spy()
  const storeSpy = {dispatch: dispatchSpy, subscribe: subscribeSpy}

  const transpiler = proxyquire('./transpiler', {
    'glob': {sync: globStub},
    'state/store': {getStore: () => storeSpy},
    'utils/babel': {transpile: transpileSpy},
    'utils/workers': {workerInit: initSpy},
  })

  beforeEach(() => {
    dispatchSpy.reset()
    globStub.reset().returns(['src/spike.js', 'src/lee.js'])
    initSpy.reset()
    subscribeSpy.reset()
    transpileSpy.reset()
    process.on.reset()
    process.send.reset()
  })

  describe('transpile()', () => {

    it('reports status to the worker and updates internal status', done => {
      const expectedActions = [inProgress(true), inProgress(false)]
      const store = mockStore({}, expectedActions, done)

      transpiler.transpile(store)

      expect(process.send).to.have.been.calledWith(workerDone(WORKER_TRANSPILER))
    })

    it('calls babel.transpile() with the appropriate arguments', done => {
      const expectedActions = [inProgress(true), inProgress(false)]
      const store = mockStore({}, expectedActions, done)

      transpiler.transpile(store)

      expect(transpileSpy).to.have.been.calledWith({
        baseDir: 'src',
        filenames: ['src/spike.js', 'src/lee.js'],
        outDir: 'build',
        sourceMaps: true,
      })
    })

  })

})
