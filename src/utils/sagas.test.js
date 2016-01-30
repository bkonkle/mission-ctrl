import {call, fork, put, take} from 'redux-saga'
import {expect} from 'chai'
import {forkWorker} from 'utils/workers'
import * as foreman from 'state/foreman'
import * as sagas from './sagas'
import * as workers from 'state/workers'
import sinon from 'sinon'

describe('utils/sagas', () => {

  describe('launchWorker()', () => {

    it('spawns a worker process', () => {
      const generator = sagas.launchWorker(workers.WORKER_WATCHER)
      const result = generator.next()

      expect(result.value).to.deep.equal(call(forkWorker, workers.WORKER_WATCHER))
    })

    it('creates a process watcher', () => {
      const proc = {}
      const generator = sagas.launchWorker(workers.WORKER_WATCHER)
      generator.next()  // yields call(forkWorker, worker)

      const result = generator.next(proc)

      expect(result.value).to.deep.equal(call(sagas.watchProcess, proc))
    })

    it('forks a notifier saga to report to the foreman', () => {
      const proc = {}
      const processWatcher = {}
      const generator = sagas.launchWorker(workers.WORKER_WATCHER)
      generator.next()  // yields call(forkWorker, worker)
      generator.next(proc)  // yields call(watchProcess, proc)

      const result = generator.next(processWatcher)

      expect(result.value).to.deep.equal(fork(sagas.notifyForeman, processWatcher))
    })

  })

  describe('watchProcess()', () => {

    it('attaches an "on" callback to the process', () => {
      const mockProcess = {on: sinon.spy(), send: sinon.spy()}
      sagas.watchProcess(mockProcess)
      expect(mockProcess.on).to.have.been.calledOnce
    })

    it('returns an object with a function that returns a promise for the next message', () => {
      const mockProcess = {on: sinon.spy(), send: sinon.spy()}
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

  describe('waitForStatus()', () => {

    it('waits for a status event for the given worker', () => {
      const generator = sagas.waitForStatus(workers.WORKER_WATCHER, workers.READY)
      const result = generator.next()

      expect(result.value).to.deep.equal(take(workers.READY))
    })

    it('completes the saga when the event is received', () => {
      const generator = sagas.waitForStatus(workers.WORKER_WATCHER, workers.READY)
      generator.next()  // yields take(workers.READY)
      const result = generator.next(workers.workerReady(workers.WORKER_WATCHER))

      expect(result.value).to.be.undefined
    })

    it('continues waiting if the status event was for another worker', () => {
      const generator = sagas.waitForStatus(workers.WORKER_WATCHER, workers.READY)
      generator.next()  // yields take(workers.READY)
      const result = generator.next(workers.workerReady(workers.WORKER_LINTER))

      expect(result.value).to.deep.equal(take(workers.READY))
    })

  })

  describe('waitForGoal()', () => {

    it('waits for a set goal event for the given worker', () => {
      const generator = sagas.waitForGoal(foreman.GOAL_WATCH)
      const result = generator.next()

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

    it('completes the saga when the event is received', () => {
      const generator = sagas.waitForGoal(foreman.GOAL_WATCH)
      generator.next()  // yields take(foreman.SET_GOAL)
      const result = generator.next(foreman.setGoal(foreman.GOAL_WATCH))

      expect(result.value).to.be.undefined
    })

    it('continues waiting if the event was for another goal', () => {
      const generator = sagas.waitForGoal(foreman.GOAL_WATCH)
      generator.next()  // yields take(foreman.SET_GOAL)
      const result = generator.next(foreman.setGoal(foreman.GOAL_LINT))

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

  })

})
