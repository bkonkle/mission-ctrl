import {fork} from 'redux-saga'
import {GOAL_WATCH} from 'state/foreman'
import {startProcess} from 'utils/sagas'
import {WORKER_WATCHER} from 'state/workers'

export default function* startWatcher() {
  yield fork(startProcess(WORKER_WATCHER, GOAL_WATCH))
}
