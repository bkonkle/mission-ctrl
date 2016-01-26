import {GOAL_TRANSPILE} from 'state/foreman'
import {inProgress} from 'workers/transpiler/state'
import {sync as glob} from 'glob'
import {transpileToDir} from 'utils/babel'
import {workerInit} from 'workers/utils'
import {workerReady, workerBusy, WORKER_TRANSPILER} from 'workers/state'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'
import path from 'path'

const log = createLogger('workers/transpiler')

export const init = workerInit(WORKER_TRANSPILER, stateChanged)

export function transpile(store) {
  log.debug('Beginning transpile')

  const config = getConfig()
  const filenames = glob(path.join(config.source, config.glob))

  process.send(workerBusy(WORKER_TRANSPILER))
  store.dispatch(inProgress(true))

  transpileToDir({
    baseDir: config.source,
    filenames,
    outDir: config.dest,
    sourceMaps: true,
  })

  log.debug('Transpile complete')

  store.dispatch(inProgress(false))
  process.send(workerReady(WORKER_TRANSPILER))
}

export function stateChanged(store) {
  log.debug('State changed')

  const state = store.getState()

  switch (state.transpiler.get('goal')) {
    case GOAL_TRANSPILE:
      if (!state.transpiler.get('inProgress')) {
        transpile(store)
      }
      break
    default:
      // Do nothing
  }
}
