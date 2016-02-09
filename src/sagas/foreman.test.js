import {call, fork, put, take} from 'redux-saga'
import {expect} from 'chai'
import {GOAL_BUNDLE, GOAL_LINT, GOAL_TEST, GOAL_TRANSPILE, GOAL_WATCH,
        SOURCE_CHANGED, setGoal, sourceChanged} from 'state/foreman'
import {launchWorker, waitForReady, waitForDone, waitForGoal} from 'utils/sagas'
import {lint} from 'state/linter'
import {transpile} from 'state/transpiler'
import {WORKER_BUNDLER, WORKER_LINTER, WORKER_TEST_RUNNER, WORKER_TRANSPILER,
        WORKER_WATCHER, workerReady} from 'state/workers'
import * as foreman from './foreman'

const startForeman = foreman.default

describe('sagas/foreman', () => {

  describe('startForeman()', () => {
    const generator = startForeman()

    it('forks the transpiler process', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(fork(foreman.startTranspiler))
    })

    it('forks the linter process', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(fork(foreman.startLinter))
    })

    it('calls the watcher process', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(foreman.startWatcher))
    })

    it('sets the goal to GOAL_WATCH', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(setGoal(GOAL_WATCH)))
    })

    it('kicks off the main event loop', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(fork(foreman.runLoop))
    })

    it('sends an initial source changed event with "__all__" as the payload', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(sourceChanged('__all__')))
    })

  })

  describe('startWatcher', () => {
    const generator = foreman.startWatcher()

    it('launches the watcher process', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(launchWorker, WORKER_WATCHER))
    })

    it('waits for it to be ready', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForReady, WORKER_WATCHER))
    })

  })

  describe('startTranspiler', () => {
    const transpiler = {send: () => {}}
    const generator = foreman.startTranspiler()

    it('launches the transpiler process', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(launchWorker, WORKER_TRANSPILER))
    })

    it('waits for it to be ready', () => {
      const result = generator.next(transpiler)
      expect(result.value).to.deep.equal(call(waitForReady, WORKER_TRANSPILER))
    })

    it('waits for GOAL_TRANSPILE events', () => {
      const result = generator.next(workerReady(WORKER_TRANSPILER))
      expect(result.value).to.deep.equal(call(waitForGoal, GOAL_TRANSPILE))
    })

    it('sends TRANSPILE events to the worker', () => {
      const result = generator.next()
      expect(result.value.CALL.fn).have.property('name', 'bound send')
      expect(result.value.CALL.args[0]).to.deep.equal(transpile())
    })

    it('goes back to waiting for GOAL_TRANSPILE events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForGoal, GOAL_TRANSPILE))
    })

  })

  describe('startLinter', () => {
    const linter = {send: () => {}}
    const generator = foreman.startLinter()

    it('launches the linter process', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(launchWorker, WORKER_LINTER))
    })

    it('waits for it to be ready', () => {
      const result = generator.next(linter)
      expect(result.value).to.deep.equal(call(waitForReady, WORKER_LINTER))
    })

    it('waits for GOAL_LINT events', () => {
      const result = generator.next(workerReady(WORKER_LINTER))
      expect(result.value).to.deep.equal(call(waitForGoal, GOAL_LINT))
    })

    it('sends LINT events to the worker', () => {
      const result = generator.next()
      expect(result.value.CALL.fn).have.property('name', 'bound send')
      expect(result.value.CALL.args[0]).to.deep.equal(lint())
    })

    it('goes back to waiting for GOAL_LINT events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForGoal, GOAL_LINT))
    })

  })

  describe('runLoop', () => {
    const generator = foreman.runLoop()

    it('waits for a source changed event', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(SOURCE_CHANGED))
    })

    it('sets the goal to GOAL_TRANSPILE with the changed file in the payload', () => {
      const result = generator.next(sourceChanged('file.js'))
      expect(result.value).to.deep.equal(
        put(setGoal(GOAL_TRANSPILE, {path: 'file.js'}))
      )
    })

    it('sets the goal to GOAL_LINT', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(setGoal(GOAL_LINT, {path: 'file.js'})))
    })

    it('waits for the transpiler to be DONE', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForDone, WORKER_TRANSPILER))
    })

    it('sets the transpiler to READY', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(workerReady(WORKER_TRANSPILER)))
    })

    it('sets the goal to GOAL_TEST', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(setGoal(GOAL_TEST, {path: 'file.js'})))
    })

    it('sets the goal to GOAL_BUNDLE', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(setGoal(GOAL_BUNDLE)))
    })

    it('waits for the bundler to be DONE', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForDone, WORKER_BUNDLER))
    })

    it('sets the bundler to READY', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(workerReady(WORKER_BUNDLER)))
    })

    it('returns to waiting for a source changed event', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(SOURCE_CHANGED))
    })

  })

})
