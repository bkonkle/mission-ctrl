import {call, fork, put} from 'redux-saga'
import {expect} from 'chai'
import {launchWorker, waitForStatus} from 'utils/sagas'
import * as foreman from './foreman'
import * as foremanState from 'state/foreman'
import * as workers from 'state/workers'

const startForeman = foreman.default

describe('sagas/foreman', () => {

  describe('startForeman()', () => {

    it('forks the watcher process', () => {
      const generator = startForeman()
      const result = generator.next()

      expect(result.value).to.deep.equal(fork(foreman.startWatcher))
    })

    it('forks the linter process', () => {
      const generator = startForeman()
      generator.next()  // yields fork(startWatcher)
      const result = generator.next()

      expect(result.value).to.deep.equal(fork(foreman.startLinter))
    })

    it('forks the transpiler process', () => {
      const generator = startForeman()
      generator.next()  // yields fork(startWatcher)
      generator.next()  // yields fork(startLinter)
      const result = generator.next()

      expect(result.value).to.deep.equal(fork(foreman.startTranspiler))
    })

    it('sets the goal to GOAL_WATCH', () => {
      const generator = startForeman()
      generator.next()  // yields fork(startWatcher)
      generator.next()  // yields fork(startLinter)
      generator.next()  // yields fork(startTranspiler)
      const result = generator.next()

      expect(result.value).to.deep.equal(put(foremanState.setGoal(foremanState.GOAL_WATCH)))
    })

  })

  describe('startWatcher', () => {

    it('launches the watcher process', () => {
      const generator = foreman.startWatcher()
      const result = generator.next()
      expect(result.value).to.deep.equal(call(launchWorker, workers.WORKER_WATCHER))
    })

    it('waits for it to be ready', () => {
      const generator = foreman.startWatcher()
      generator.next()  // yields call(launchWorker(WORKER_WATCHER))
      const result = generator.next()

      expect(result.value).to.deep.equal(call(waitForStatus, workers.WORKER_WATCHER, workers.READY))
    })

  })

  describe('startLinter', () => {

    it('launches the linter process', () => {
      const generator = foreman.startLinter()
      const result = generator.next()
      expect(result.value).to.deep.equal(call(launchWorker, workers.WORKER_LINTER))
    })

    it('waits for it to be ready', () => {
      const generator = foreman.startLinter()
      generator.next()  // yields call(launchWorker(WORKER_LINTER))
      const result = generator.next()

      expect(result.value).to.deep.equal(call(waitForStatus, workers.WORKER_LINTER, workers.READY))
    })

  })

  describe('startTranspiler', () => {

    it('launches the transpiler process', () => {
      const generator = foreman.startTranspiler()
      const result = generator.next()
      expect(result.value).to.deep.equal(call(launchWorker, workers.WORKER_TRANSPILER))
    })

    it('waits for it to be ready', () => {
      const generator = foreman.startTranspiler()
      generator.next()  // yields call(launchWorker(WORKER_TRANSPILER))
      const result = generator.next()

      expect(result.value).to.deep.equal(call(waitForStatus, workers.WORKER_TRANSPILER, workers.READY))
    })

  })

})
