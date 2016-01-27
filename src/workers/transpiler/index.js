import {GOAL_TRANSPILE} from 'state/foreman'
import {inProgress, setGoal} from 'workers/transpiler/state'
import {sync as glob} from 'glob'
import {workerInit} from 'workers/utils'
import {workerBusy, workerDone, WORKER_TRANSPILER} from 'state/workers'
import * as babel from 'utils/babel'
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

  babel.transpile({
    baseDir: config.source,
    filenames,
    outDir: config.dest,
    sourceMaps: true,
  })

  log.debug('Transpile complete')

  store.dispatch(setGoal(null))
  store.dispatch(inProgress(false))
  process.send(workerDone(WORKER_TRANSPILER))
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

if (require.main === module) {
  init()
}
