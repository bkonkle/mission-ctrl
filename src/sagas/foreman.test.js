import {apply, call, fork, join, put, take} from 'redux-saga'
import {TASK} from 'redux-saga/lib/utils'
import {expect} from 'chai'
import {SOURCE_CHANGED, sourceChanged} from 'state/foreman'
import {launchWorker, waitForReady, waitForDone} from 'utils/sagas'
import {lint} from 'state/linter'
import {transpile} from 'state/transpiler'
import {runTests} from 'state/test-runner'
import {WORKER_BUNDLER, WORKER_LINTER, WORKER_TEST_RUNNER, WORKER_TRANSPILER,
        WORKER_WATCHER, workerReady} from 'state/workers'
import startForeman, {runLoop, startWorker} from './foreman'

describe('sagas/foreman', () => {
  const transpiler = {send: () => {}}
  const linter = {send: () => {}}
  const testRunner = {send: () => {}}
  const testPath = '/test'

  describe('startForeman()', () => {
    const watcherSaga = {[TASK]: true, name: 'watcher'}
    const transpilerSaga = {[TASK]: true, name: 'transpiler'}
    const linterSaga = {[TASK]: true, name: 'linter'}
    const testRunnerSaga = {[TASK]: true, name: 'test-runner'}
    const generator = startForeman()

    it('forks the watcher', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(fork(startWorker, WORKER_WATCHER))
    })

    it('forks the transpiler', () => {
      const result = generator.next(watcherSaga)
      expect(result.value).to.deep.equal(fork(startWorker, WORKER_TRANSPILER))
    })

    it('forks the linter', () => {
      const result = generator.next(transpilerSaga)
      expect(result.value).to.deep.equal(fork(startWorker, WORKER_LINTER))
    })

    it('forks the test runner', () => {
      const result = generator.next(linterSaga)
      expect(result.value).to.deep.equal(fork(startWorker, WORKER_TEST_RUNNER))
    })

    it('joins the watcher', () => {
      const result = generator.next(testRunnerSaga)
      expect(result.value).to.deep.equal(join(watcherSaga))
    })

    it('joins the transpiler', () => {
      const result = generator.next(testRunner)
      expect(result.value).to.deep.equal(join(transpilerSaga))
    })

    it('joins the linter', () => {
      const result = generator.next(transpiler)
      expect(result.value).to.deep.equal(join(linterSaga))
    })

    it('joins the test runner', () => {
      const result = generator.next(linter)
      expect(result.value).to.deep.equal(join(testRunnerSaga))
    })

    it('forks the run loop', () => {
      const result = generator.next(testRunner)
      expect(result.value).to.deep.equal(fork(runLoop, {linter, testRunner, transpiler}))
    })

    it('dispatches initial source changed event', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(sourceChanged('__all__')))
    })

    it('ends the saga', () => {
      const result = generator.next()
      expect(result.done).to.be.true
    })

  })

  describe('runLoop()', () => {
    const generator = runLoop({linter, testRunner, transpiler})

    it('waits for a source changed event', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(SOURCE_CHANGED))
    })

    it('transpiles the source', () => {
      const result = generator.next({type: SOURCE_CHANGED, payload: testPath})
      expect(result.value).to.deep.equal(apply(transpiler, transpiler.send, [transpile(testPath)]))
    })

    it('lints the source', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(apply(linter, linter.send, [lint(testPath)]))
    })

    it('waits for the transpiler to finish', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForDone, WORKER_TRANSPILER))
    })

    it('sets the transpiler to ready', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(workerReady(WORKER_TRANSPILER)))
    })

    it('runs the tests', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(apply(testRunner, testRunner.send, [runTests(testPath)]))
    })

    it('waits for the bundler to be done', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(waitForDone, WORKER_BUNDLER))
    })

    it('sets the bundler to ready', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(workerReady(WORKER_BUNDLER)))
    })

    it('returns to waiting for source changed events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(SOURCE_CHANGED))
    })

  })

  describe('startWorker()', () => {
    const worker = {}
    const generator = startWorker(WORKER_LINTER)

    it('launches the requested worker', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(launchWorker, WORKER_LINTER))
    })

    it('waits for it to be ready', () => {
      const result = generator.next(worker)
      expect(result.value).to.deep.equal(call(waitForReady, WORKER_LINTER))
    })

    it('returns the proc', () => {
      const result = generator.next()
      expect(result.done).to.be.true
      expect(result.value).to.deep.equal(worker)
    })

  })

})
