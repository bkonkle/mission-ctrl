import {apply, call, fork, join, put, take} from 'redux-saga'
import {forkWorker, streams} from 'utils/workers'
import {SET_GOAL} from 'state/foreman'
import {DONE, READY, initialState} from 'state/workers'
import createLogger, {logStream} from 'utils/logging'
import slug from 'slug'

const log = createLogger('utils/sagas')

export function* launchWorker(worker) {
  const name = initialState.getIn([worker, 'name'])
  log.debug(`—— ${name} starting ——`)

  const proc = yield call(forkWorker, worker)
  const stream = streams.get(slug(name, {lower: true}))
  yield apply(proc.stdout, proc.stdout.pipe, stream)
  yield apply(logStream, logStream.pipe, stream)

  const processWatcher = yield call(watchProcess, proc)
  yield fork(notifyForeman, processWatcher)
  return proc
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
    log.trace('Message received:', message.type)
    yield put(message)
  }
}

export function* waitForStatus(status, workers) {
  if (Array.isArray(workers)) {
    const tasks = []
    for (const wkr of workers) {
      const task = yield fork(waitForStatus, status, wkr)
      tasks.push(task)
    }
    for (const task of tasks) {
      yield join(task)
    }
  } else {
    while (true) {
      const action = yield take(status)
      if (action.payload.worker === workers) {
        return
      }
    }
  }
}

export function* waitForReady(workers) {
  yield call(waitForStatus, READY, workers)
}

export function* waitForDone(workers) {
  yield call(waitForStatus, DONE, workers)
}

export function* waitForGoal(goal) {
  while (true) {
    const action = yield take(SET_GOAL)
    if (action.payload.goal === goal) {
      return
    }
  }
}
