import {CLIEngine} from 'eslint'
import {WORKER_LINTER} from 'state/workers'
import {workerInit} from 'utils/workers'
import chalk from 'chalk'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'
import saga from 'sagas/linter'

const log = createLogger('workers/linter')

export function init() {
  workerInit(WORKER_LINTER, saga)
}

export function lint() {
  const config = getConfig()

  const linter = new CLIEngine({extensions: ['.js', '.jsx']})
  const report = linter.executeOnFiles([config.source])
  if (report && report.results) logReport(report)

  log.info('—— Linting complete ——')
}

export function logReport(report, info = log.info.bind(log)) {
  const formatter =	CLIEngine.getFormatter()
  const results = formatter(report.results)
  if (results) {
    info(results)
  } else {
    info(`Your code is ${chalk.green('lint free')}! 👍`)
  }
}

if (require.main === module) {
  init()
}
