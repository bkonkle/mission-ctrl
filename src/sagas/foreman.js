import {apply, call, fork, join, put, take} from 'redux-saga'
import {launchWorker, waitForReady, waitForDone} from 'utils/sagas'
import {lint} from 'state/linter'
import {transpile} from 'state/transpiler'
import {runTests} from 'state/test-runner'
import {SOURCE_CHANGED, sourceChanged} from 'state/foreman'
import {WORKER_BUNDLER, WORKER_LINTER, WORKER_TEST_RUNNER, WORKER_TRANSPILER,
        WORKER_WATCHER, workerReady} from 'state/workers'
import createLogger from 'utils/logging'

const log = createLogger('sagas/foreman')

export default function* startForeman() {
  const watcherSaga = yield fork(startWorker, WORKER_WATCHER)
  const transpilerSaga = yield fork(startWorker, WORKER_TRANSPILER)
  const linterSaga = yield fork(startWorker, WORKER_LINTER)
  const testRunnerSaga = yield fork(startWorker, WORKER_TEST_RUNNER)
  yield join(watcherSaga)
  const transpiler = yield join(transpilerSaga)
  const linter = yield join(linterSaga)
  const testRunner = yield join(testRunnerSaga)
  yield fork(runLoop, {linter, testRunner, transpiler})
  yield put(sourceChanged('__all__'))
}

export function* runLoop({linter, testRunner, transpiler}) {
  log.debug('—— Starting main loop ——')
  while (true) {
    const action = yield take(SOURCE_CHANGED)
    const path = action.payload
    yield apply(transpiler, transpiler.send, [transpile(path)])
    yield apply(linter, linter.send, [lint(path)])
    yield call(waitForDone, WORKER_TRANSPILER)
    yield put(workerReady(WORKER_TRANSPILER))
    yield apply(testRunner, testRunner.send, [runTests(path)])
    // TODO: Bundle here!
    yield call(waitForDone, WORKER_BUNDLER)
    yield put(workerReady(WORKER_BUNDLER))
  }
}

export function* startWorker(worker) {
  const proc = yield call(launchWorker, worker)
  yield call(waitForReady, worker)
  return proc
}
