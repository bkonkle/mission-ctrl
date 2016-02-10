import {apply, call, fork, put, take} from 'redux-saga'
import {launchWorker, waitForReady, waitForDone, waitForGoal} from 'utils/sagas'
import {lint} from 'state/linter'
import {transpile} from 'state/transpiler'
import {runTests} from 'state/test-runner'
import {GOAL_BUNDLE, GOAL_LINT, GOAL_TEST, GOAL_TRANSPILE, GOAL_WATCH,
        SOURCE_CHANGED, setGoal, sourceChanged} from 'state/foreman'
import {WORKER_BUNDLER, WORKER_LINTER, WORKER_TEST_RUNNER, WORKER_TRANSPILER,
        WORKER_WATCHER, workerReady} from 'state/workers'
import createLogger from 'utils/logging'

const log = createLogger('sagas/foreman')

export default function* startForeman() {
  yield fork(startTranspiler)
  yield fork(startLinter)
  yield fork(startTestRunner)
  yield call(startWatcher)
  yield put(setGoal(GOAL_WATCH))
  yield fork(runLoop)
  yield put(sourceChanged('__all__'))
}

export function* startWatcher() {
  yield call(launchWorker, WORKER_WATCHER)
  yield call(waitForReady, WORKER_WATCHER)
}

export function* startTranspiler() {
  const transpiler = yield call(launchWorker, WORKER_TRANSPILER)
  yield call(waitForReady, WORKER_TRANSPILER)
  while (true) {
    yield call(waitForGoal, GOAL_TRANSPILE)
    yield apply(transpiler, transpiler.send, [transpile()])
  }
}

export function* startLinter() {
  const linter = yield call(launchWorker, WORKER_LINTER)
  yield call(waitForReady, WORKER_LINTER)
  while (true) {
    yield call(waitForGoal, GOAL_LINT)
    yield apply(linter, linter.send, [lint()])
  }
}

export function* startTestRunner() {
  const transpiler = yield call(launchWorker, WORKER_TEST_RUNNER)
  yield call(waitForReady, WORKER_TEST_RUNNER)
  while (true) {
    yield call(waitForGoal, GOAL_TEST)
    yield apply(transpiler, transpiler.send, [runTests()])
  }
}

export function* runLoop() {
  log.debug('—— Starting main loop ——')
  while (true) {
    const action = yield take(SOURCE_CHANGED)
    const path = action.payload
    yield put(setGoal(GOAL_TRANSPILE, {path}))
    yield put(setGoal(GOAL_LINT, {path}))
    yield call(waitForDone, WORKER_TRANSPILER)
    yield put(workerReady(WORKER_TRANSPILER))
    yield put(setGoal(GOAL_TEST, {path}))
    yield put(setGoal(GOAL_BUNDLE))
    yield call(waitForDone, WORKER_BUNDLER)
    yield put(workerReady(WORKER_BUNDLER))
  }
}
