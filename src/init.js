import 'babel-polyfill'
import {newStore} from 'state/store'
import {workerInit, streams} from 'utils/workers'
import * as workers from 'state/workers'
import createLogger, {logStream} from 'utils/logging'
import initLinter from 'sagas/linter'
import initTestRunner from 'sagas/test-runner'
import initTranspiler from 'sagas/transpiler'
import sourceMaps from 'source-map-support'
import startForeman from 'sagas/foreman'

sourceMaps.install()

const log = createLogger('init')

export function initForeman() {
  newStore(startForeman)

  const stream = streams.get('foreman')
  logStream.pipe(stream)

  log.debug('—— Ship Yard successfully initialized ——')
}

export function initWorker(worker) {
  switch (worker) {
    case workers.WORKER_WATCHER:
      workerInit(workers.WORKER_WATCHER)
      break
    case workers.WORKER_TRANSPILER:
      workerInit(workers.WORKER_TRANSPILER, initTranspiler)
      break
    case workers.WORKER_LINTER:
      workerInit(workers.WORKER_LINTER, initLinter)
      break
    case workers.WORKER_TEST_RUNNER:
      workerInit(workers.WORKER_TEST_RUNNER, initTestRunner)
      break
    default:
      throw new Error('Invalid worker requested.')
  }
}

if (require.main === module) {
  initWorker(process.argv[2])
}
