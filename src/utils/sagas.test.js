import {call, put} from 'redux-saga'
import {expect} from 'chai'
import * as workers from 'state/workers'
import * as sagas from './sagas'
import sinon from 'sinon'

describe('utils/sagas', () => {

  const mockProcess = {on: sinon.spy(), send: sinon.spy()}

  beforeEach(() => {
    mockProcess.on.reset()
    mockProcess.send.reset()
  })

  describe('watchProcess()', () => {

    it('attaches an "on" callback to the process', () => {
      sagas.watchProcess(mockProcess)
      expect(mockProcess.on).to.have.been.calledOnce
    })

    it('returns an object with a function that returns a promise for the next message', () => {
      const processWatcher = sagas.watchProcess(mockProcess)
      expect(processWatcher).to.have.property('nextMessage').and.be.a.function
      const callback = mockProcess.on.firstCall.args[1]
      expect(callback).to.be.a.function

      const promise = processWatcher.nextMessage()
      callback(workers.workerBusy(workers.WORKER_WATCHER))

      expect(promise).to.eventually.equal(workers.workerBusy(workers.WORKER_WATCHER))
    })

  })

  describe('notifyForeman()', () => {

    it('calls nextMessage on the process watcher', () => {
      const messageSource = {nextMessage: () => {}}
      const generator = sagas.notifyForeman(messageSource)

      const result = generator.next()
      expect(result.value).to.deep.equal(call(messageSource.nextMessage))
    })

    it('dispatches any messages received', () => {
      const messageSource = {nextMessage: () => {}}
      const generator = sagas.notifyForeman(messageSource)
      generator.next()  // yields call(messageSource.nextMessage)

      const result = generator.next(workers.workerBusy(workers.WORKER_WATCHER))

      expect(result.value).to.deep.equal(put(workers.workerBusy(workers.WORKER_WATCHER)))
    })

  })

})
