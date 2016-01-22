import {getStore} from 'state/store'
import {values} from 'ramda'
import createLogger from 'utils/logging'
import Threads from 'webworker-threads'
import transpiler from 'workers/transpiler'

const log = createLogger('foreman')

export function init(storeOverride) {
  const store = storeOverride || getStore()

  const workers = {
    transpiler: new Threads.Worker(transpiler(store)),
  }

  const dispatchAction = action => store.dispatch(action)
  values(workers).forEach(worker => {
    worker.onmessage = dispatchAction
  })

  log.debug('Foreman successfully initialized.')
}

if (require.main === module) {
  init()
}
