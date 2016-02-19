import {apply, call, put, take} from 'redux-saga'
import {done, TEST} from 'state/test-runner'
import {execSync} from 'child_process'
import {tmp} from 'utils/fs'
import {WORKER_TEST_RUNNER, workerReady} from 'state/workers'
import createLogger from 'utils/logging'
import fs from 'fs'
import getConfig from 'utils/config'
import path from 'path'

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

export function* runTests(configOverride) {
  const config = configOverride || getConfig()
  const dest = tmp(config.dest)
  const mocha = path.join(path.dirname(require.resolve('mocha')), 'bin', 'mocha')
  let options = '--reporter dot'

  const testSetup = path.join(dest, 'utils', 'test-setup.js')
  if (fs.existsSync(testSetup)) {
    options += ` --require utils/test-setup`
  }

  log.debug(`Running tests in ${dest}`)

  try {
    execSync(`${mocha} ${options} '**/*.test.js'`, {
      cwd: dest,
      env: {
        NODE_PATH: `${process.env.NODE_PATH}:${dest}`,
      },
      stdio: 'inherit',
    })
  } catch (e) {
    log.error(e)
  }

  log.info('—— Test runner complete ——')
}
