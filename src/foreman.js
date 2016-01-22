import {getStore} from 'state/store'
import {values} from 'ramda'
import compiler from 'workers/compiler'
import createLogger from 'utils/logging'
import Threads from 'webworker-threads'

const log = createLogger('foreman')

export function init(store) {
  const {dispatch} = store || getStore()

  const workers = {
    compiler: new Threads.Worker(compiler),
  }

  const dispatchAction = action => dispatch(action)
  values(workers).forEach(worker => {
    worker.onmessage = dispatchAction
  })

  log.debug('Foreman successfully initialized.')
}

if (require.main === module) {
  init()
}
