import {CLIEngine} from 'eslint'
import {GOAL_LINT} from 'state/foreman'
import {inProgress, setGoal} from 'workers/linter/state'
import {workerBusy, workerDone, WORKER_LINTER} from 'state/workers'
import {workerInit} from 'utils/workers'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'

const log = createLogger('workers/linter')

export const init = workerInit(WORKER_LINTER, stateChanged)

export function lint(store) {
  log.info('—— Linter starting ——')

  const config = getConfig()

  process.send(workerBusy(WORKER_LINTER))
  store.dispatch(inProgress(true))

  const linter = new CLIEngine()
  const report = linter.executeOnFiles([config.source])
  if (report && report.results) {
    logReport(report)
  }

  log.info('—— Linting complete ——')

  store.dispatch(setGoal(null))
  store.dispatch(inProgress(false))
  process.send(workerDone(WORKER_LINTER))
}

export function stateChanged(store) {
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

export function logReport(report, info = log.info.bind(log)) {
  const formatter =	CLIEngine.getFormatter()
  info(formatter(report.results))
}

if (require.main === module) {
  init()
}
