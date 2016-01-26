import {CLIEngine} from 'eslint'
import {GOAL_LINT} from 'state/foreman'
import {inProgress} from 'workers/linter/state'
import {workerReady, workerBusy, WORKER_LINTER} from 'state/workers'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'

const log = createLogger('workers/linter')

export function init() {

}

export function lint(store) {
  log.debug('Beginning transpile')

  const config = getConfig()

  process.send(workerBusy(WORKER_LINTER))
  store.dispatch(inProgress(true))

  const linter = new CLIEngine()
  const report = linter.executeOnFiles([config.source])
  console.log('report ------------------>', report)

  log.debug('Transpile complete')

  store.dispatch(inProgress(false))
  process.send(workerReady(WORKER_LINTER))
}

export function stateChanged(store) {
  log.debug('State changed')

  const state = store.getState()

  switch (state.linter.get('goal')) {
    case GOAL_LINT:
      if (!state.linter.get('inProgress')) {
        lint(store)
      }
      break
    default:
      // Do nothing
  }
}
