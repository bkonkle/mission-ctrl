import {call, put} from 'redux-saga'
import createLogger from 'utils/logging'

const log = createLogger('utils/sagas')

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
