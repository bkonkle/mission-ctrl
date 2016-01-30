import {call, fork, put} from 'redux-saga'
import {launchWorker, waitForStatus} from 'utils/sagas'
import * as foreman from 'state/foreman'
import * as workers from 'state/workers'
import createLogger from 'utils/logging'

const log = createLogger('sagas/foreman')

export default function* startForeman() {
  yield fork(startWatcher)
  yield fork(startLinter)
  yield fork(startTranspiler)
  yield put(foreman.setGoal(foreman.GOAL_WATCH))
}

export function* startWatcher() {
  yield call(launchWorker, workers.WORKER_WATCHER)
  yield call(waitForStatus, workers.WORKER_WATCHER, workers.READY)
}

export function* startLinter() {
  yield call(launchWorker, workers.WORKER_LINTER)
  yield call(waitForStatus, workers.WORKER_LINTER, workers.READY)
}

export function* startTranspiler() {
  yield call(launchWorker, workers.WORKER_TRANSPILER)
  yield call(waitForStatus, workers.WORKER_TRANSPILER, workers.READY)
}
