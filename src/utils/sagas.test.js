import {apply, call, fork, join, put, take} from 'redux-saga'
import {expect} from 'chai'
import {forkWorker, streams} from 'utils/workers'
import {DONE, READY, WORKER_LINTER, WORKER_TEST_RUNNER, WORKER_WATCHER,
        workerBusy, workerReady} from 'state/workers'
import {TASK} from 'redux-saga/lib/utils'
import {launchWorker, watchProcess, notifyForeman, waitForStatus,
        waitForReady, waitForDone} from './sagas'
import sinon from 'sinon'

describe('utils/sagas', () => {

  describe('launchWorker()', () => {
    const proc = {stdout: {pipe: () => {}}, stderr: {pipe: () => {}}}
    const processWatcher = {}

    const generator = launchWorker(WORKER_WATCHER)

    it('spawns a worker process', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(forkWorker, WORKER_WATCHER))
    })

    it('connects the stdout of the process to the worker stream', () => {
      const result = generator.next(proc)
      expect(result.value).to.deep.equal(apply(proc.stdout, proc.stdout.pipe, [streams.get('watcher')]))
    })

    it('connects the stderr of the process to the worker stream', () => {
      const result = generator.next(proc)
      expect(result.value).to.deep.equal(apply(proc.stderr, proc.stderr.pipe, [streams.get('watcher')]))
    })

    it('creates a process watcher', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(watchProcess, proc))
    })

    it('forks a notifier saga to report to the foreman', () => {
      const result = generator.next(processWatcher)
      expect(result.value).to.deep.equal(fork(notifyForeman, processWatcher))
    })

    it('returns the proc so that messages can be sent to the worker', () => {
      const result = generator.next()
      expect(result.done).to.be.true
      expect(result.value).to.equal(proc)
    })

  })

  describe('watchProcess()', () => {

    it('attaches an "on" callback to the process', () => {
      const mockProcess = {on: sinon.spy(), send: sinon.spy()}
      watchProcess(mockProcess)
      expect(mockProcess.on).to.have.been.calledOnce
    })

    it('returns an object with a function that returns a promise for the next message', () => {
      const mockProcess = {on: sinon.spy(), send: sinon.spy()}
      const processWatcher = watchProcess(mockProcess)
      expect(processWatcher).to.have.property('nextMessage').and.be.a.function
      const callback = mockProcess.on.firstCall.args[1]
      expect(callback).to.be.a.function

      const promise = processWatcher.nextMessage()
      callback(workerBusy(WORKER_WATCHER))

      expect(promise).to.eventually.equal(workerBusy(WORKER_WATCHER))
    })

  })

  describe('notifyForeman()', () => {

    it('calls nextMessage on the process watcher', () => {
      const messageSource = {nextMessage: () => {}}
      const generator = notifyForeman(messageSource)

      const result = generator.next()
      expect(result.value).to.deep.equal(call(messageSource.nextMessage))
    })

    it('dispatches any messages received', () => {
      const messageSource = {nextMessage: () => {}}
      const generator = notifyForeman(messageSource)
      generator.next()  // yields call(messageSource.nextMessage)

      const result = generator.next(workerBusy(WORKER_WATCHER))

      expect(result.value).to.deep.equal(put(workerBusy(WORKER_WATCHER)))
    })

  })

  describe('waitForStatus()', () => {
    const linterTask = {[TASK]: true}
    const testRunnerTask = {[TASK]: true}

    let generator = waitForStatus(READY, WORKER_WATCHER)

    it('waits for a status event for the given worker', () => {
      const result = generator.next()

      expect(result.value).to.deep.equal(take(READY))
    })

    it('completes the saga when the event is received', () => {
      const result = generator.next(workerReady(WORKER_WATCHER))
      expect(result.done).to.be.true
    })

    it('continues waiting if the status event was for another worker', () => {
      generator = waitForStatus(READY, WORKER_WATCHER)
      generator.next()  // yields take(READY)
      const result = generator.next(workerReady(WORKER_LINTER))

      expect(result.value).to.deep.equal(take(READY))
    })

    it('forks multiple waitForStatus instances if an array of workers was given', () => {
      generator = waitForStatus(READY, [WORKER_LINTER, WORKER_TEST_RUNNER])

      let result = generator.next()
      expect(result.value).to.deep.equal(fork(waitForStatus, READY, WORKER_LINTER))

      result = generator.next(linterTask)
      expect(result.value).to.deep.equal(fork(waitForStatus, READY, WORKER_TEST_RUNNER))
    })

    it('waits for the multiple instances to complete', () => {
      let result = generator.next(testRunnerTask)
      expect(result.value).to.deep.equal(join(linterTask))

      result = generator.next()
      expect(result.value).to.deep.equal(join(testRunnerTask))
    })

    it('completes the saga', () => {
      const result = generator.next()
      expect(result.done).to.be.true
    })

  })

  describe('waitForReady()', () => {

    it('calls waitForStatus with READY and the given workers', () => {
      const generator = waitForReady(WORKER_LINTER)
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForStatus, READY, WORKER_LINTER))
    })

  })

  describe('waitForDone()', () => {

    it('calls waitForStatus with DONE and the given workers', () => {
      const generator = waitForDone(WORKER_LINTER)
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForStatus, DONE, WORKER_LINTER))
    })

  })

})
