import {inProgress} from 'state/transpiler'
import {sync as glob} from 'glob'
import {workerInit} from 'utils/workers'
import {workerDone, WORKER_TRANSPILER} from 'state/workers'
import * as babel from 'utils/babel'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'
import path from 'path'
import saga from 'sagas/transpiler'

const log = createLogger('workers/transpiler')

export function init() {
  workerInit(WORKER_TRANSPILER, saga)
}

export function transpile(store) {
  const config = getConfig()
  const filenames = glob(path.join(config.source, config.glob))

  store.dispatch(inProgress(true))

  babel.transpile({
    baseDir: config.source,
    filenames,
    outDir: config.dest,
    sourceMaps: true,
  })

  log.info('—— Transpilation complete ——')

  store.dispatch(inProgress(false))
  process.send(workerDone(WORKER_TRANSPILER))
}

if (require.main === module) {
  init()
}
