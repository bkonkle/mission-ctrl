import {apply, call, put, take} from 'redux-saga'
import {CLIEngine} from 'eslint'
import {done, LINT} from 'state/linter'
import {WORKER_LINTER, workerReady} from 'state/workers'
import chalk from 'chalk'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'

const log = createLogger('sagas/linter')

export default function* initLinter() {
  log.debug('—— Linter listening ——')
  while (true) {
    yield take(LINT)
    yield call(lint)
    yield put(done())
    yield apply(process, process.send, workerReady(WORKER_LINTER))
  }
}

export function getEngine() {
  return new CLIEngine({extensions: ['.js', '.jsx']})
}

export function* lint() {
  const config = getConfig()

  const linter = yield call(getEngine)
  const report = yield apply(linter, linter.executeOnFiles, [config.source])
  if (report && report.results) yield call(logReport, report)

  log.info('—— Linting complete ——')
}

export function* logReport(report, info = log.info.bind(log)) {
  const formatter =	yield call(CLIEngine.getFormatter)
  const results = yield call(formatter, report.results)
  if (results) {
    yield call(info, results)
  } else {
    yield call(info, `Your code is ${chalk.green('lint free')}! 👍`)
  }
}
