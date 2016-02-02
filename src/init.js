import 'babel-polyfill'
import {newStore} from 'state/store'
import {workerInit, streams} from 'utils/workers'
import {WORKER_LINTER, WORKER_TRANSPILER, WORKER_WATCHER} from 'state/workers'
import createLogger from 'utils/logging'
import initLinter from 'sagas/linter'
import initTranspiler from 'sagas/transpiler'
import startForeman from 'sagas/foreman'

const log = createLogger('init')

export default function init(worker) {
  switch (worker) {
    case WORKER_WATCHER:
      workerInit(WORKER_WATCHER)
      break
    case WORKER_TRANSPILER:
      workerInit(WORKER_TRANSPILER, initTranspiler)
      break
    case WORKER_LINTER:
      workerInit(WORKER_LINTER, initLinter)
      break
    default:
      newStore(startForeman)
      log.debug('—— Ship Yard successfully initialized ——')
      return streams
  }
}

if (require.main === module) {
  init(process.argv[2])
}
