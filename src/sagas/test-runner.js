import {apply, call, put, take} from 'redux-saga'
import {done, TEST} from 'state/test-runner'
import {sync as glob} from 'glob'
import {tempDir} from 'utils/fs'
import {WORKER_TEST_RUNNER, workerReady} from 'state/workers'
import chalk from 'chalk'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'
import Mocha from 'mocha'
import path from 'path'
import plur from 'plur'

const log = createLogger('sagas/test-runner')
const mocha = new Mocha({reporter: 'min'})

export default function* initTestRunner() {
  log.debug('—— Test runner listening ——')
  while (true) {
    yield take(TEST)
    yield call(runTests)
    yield put(done())
    yield apply(process, process.send, [workerReady(WORKER_TEST_RUNNER)])
  }
}

export function* runTests(configOverride, mochaOverride) {
  const config = configOverride || getConfig()
  const runner = mochaOverride || mocha
  runner.files = yield call(glob, path.join(tempDir, config.dest, config.glob))

  yield apply(runner, runner.run, [logResults])

  log.info('—— Test runner complete ——')
  return call(clearCache)
}

export function* logResults(errCount, info = log.info) {
  if (errCount > 0) {
    return apply(log, info, [chalk.red(`${errCount} ${plur('test', errCount)} failed.`)])
  }
  return apply(log, info, [chalk.green('All tests passed! 👍')])
}

export function clearCache(requireOverride) {
  const req = requireOverride || require
  for (const key in req.cache) {
    if (!/\.node$/.test(key)) delete req.cache[key]
  }
}
