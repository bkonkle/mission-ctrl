import {call, fork, put, take} from 'redux-saga'
import {forkWorker} from 'utils/workers'
import createLogger from 'utils/logging'
import * as foreman from 'state/foreman'
import * as workers from 'state/workers'

const log = createLogger('utils/sagas')

export const startProcess = (worker, goal) => function* startProcessSaga(getState) {
  log.debug('—— Watcher starting ——')
  while (true) {
    const action = yield take(foreman.SET_GOAL)
    if (action.payload.goal === goal) {
      const state = getState()
      const status = state.workers.getIn([worker, 'status'])

      if (status === workers.OFFLINE) {
        yield put(workers.workerBusy(worker))

        const proc = forkWorker(worker)
        const processWatcher = yield call(watchProcess, proc)
        yield fork(notifyForeman, processWatcher)

        while (true) {
          const ready = yield take(workers.READY)
          if (ready.payload.worker === worker) {
            break
          }
        }
      }
    }
  }
}

export function watchProcess(proc) {
  let deferred
  proc.on('message', message => {
    if (deferred) {
      deferred.resolve(message)
      deferred = null
    } else {
      throw new Error('No promise was available to handle the message.')
    }
  })

  return {
    nextMessage: () => {
      if (!deferred) {
        deferred = {}
        deferred.promise = new Promise(resolve => deferred.resolve = resolve)
      }
      return deferred.promise
    },
  }
}

export function* notifyForeman(messageSource) {
  while (true) {
    const message = yield call(messageSource.nextMessage)
    log.debug('Message received:', message.type)
    yield put(message)
  }
}
