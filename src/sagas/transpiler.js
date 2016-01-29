import {call, put, fork, take} from 'redux-saga'
import {forkWorker} from 'utils/workers'
import {notifyForeman, watchProcess} from 'utils/sagas'
import {transpile} from 'workers/transpiler'
import * as foreman from 'state/foreman'
import * as workers from 'state/workers'
import createLogger from 'utils/logging'

const log = createLogger('sagas/transpiler')

export function* startTranspiler(getState) {
  log.debug('—— Transpiler starting ——')
  while (true) {
    const action = yield take(foreman.SET_GOAL)
    if (action.payload.goal === foreman.GOAL_TRANSPILE) {
      const state = getState()
      const status = state.workers.getIn([workers.WORKER_TRANSPILER, 'status'])

      if (status === workers.OFFLINE) {
        yield put(workers.workerBusy(workers.WORKER_TRANSPILER))

        const transpiler = forkWorker('transpiler')
        const processWatcher = yield call(watchProcess, transpiler)
        yield fork(notifyForeman, processWatcher)

        while (true) {
          const ready = yield take(workers.READY)
          if (ready.payload.worker === workers.WORKER_TRANSPILER) {
            yield call(transpile)
            break
          }
        }
      }
    }
  }
}
