import {call, fork, put, take} from 'redux-saga'
import {forkWorker} from 'utils/workers'
import {WORKERS} from 'state/workers'
import * as foreman from 'state/foreman'
import createLogger from 'utils/logging'

const log = createLogger('utils/sagas')

export function* launchWorker(worker) {
  log.debug(`—— ${WORKERS[worker].name} starting ——`)
  const proc = yield call(forkWorker, worker)
  const processWatcher = yield call(watchProcess, proc)

  yield fork(notifyForeman, processWatcher)
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

export function* waitForStatus(worker, status) {
  while (true) {
    const action = yield take(status)
    if (action.payload.worker === worker) {
      return
    }
  }
}

export function* waitForGoal(goal) {
  while (true) {
    const action = yield take(foreman.SET_GOAL)
    if (action.payload.goal === goal) {
      return
    }
  }
}
