import {forkWorker} from 'utils/workers'
import {call, put, fork, take} from 'redux-saga'
import {notifyForeman, watchProcess} from 'utils/sagas'
import * as foreman from 'state/foreman'
import * as workers from 'state/workers'
import createLogger from 'utils/logging'

const log = createLogger('sagas/watcher')

export function* startWatcher(getState) {
  log.debug('—— Watcher starting ——')
  while (true) {
    const action = yield take(foreman.SET_GOAL)
    if (action.payload.goal === foreman.GOAL_WATCH) {
      const state = getState()
      const status = state.workers.getIn([workers.WORKER_WATCHER, 'status'])

      if (status === workers.OFFLINE) {
        yield put(workers.workerBusy(workers.WORKER_WATCHER))

        const watcher = forkWorker('watcher')
        const processWatcher = yield call(watchProcess, watcher)
        yield fork(notifyForeman, processWatcher)

        while (true) {
          const ready = yield take(workers.READY)
          if (ready.payload.worker === workers.WORKER_WATCHER) {
            break
          }
        }
      }
    }
  }
}
