import {apply, call, put, take} from 'redux-saga'
import {done, TEST} from 'state/test-runner'
import {sync as glob} from 'glob'
import {tmp} from 'utils/fs'
import {WORKER_TEST_RUNNER, workerReady} from 'state/workers'
import chalk from 'chalk'
import createLogger from 'utils/logging'
import fs from 'fs'
import getConfig from 'utils/config'
import Mocha from 'mocha'
import path from 'path'
import plur from 'plur'
import reqFrom from 'req-from'

const log = createLogger('sagas/test-runner')

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
  const mocha = mochaOverride || new Mocha({
    reporter: 'dot',
    useColors: true,
  })

  if (fs.existsSync(path.join(tmp(config.dest), 'utils', 'test-setup.js'))) {
    yield call(reqFrom, tmp(config.dest), './utils/test-setup')
  }

  mocha.files = yield call(glob, tmp(path.join(config.dest, config.glob)))

  log.debug(`Running tests in ${tmp(path.join(config.dest, config.glob))}`)

  yield apply(mocha, mocha.run, [logResults])

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
