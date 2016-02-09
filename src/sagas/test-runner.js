import {apply, call, put, take} from 'redux-saga'
import {done, TEST} from 'state/test-runner'
import {sync as glob} from 'glob'
import {WORKER_TEST_RUNNER, workerReady} from 'state/workers'
import chalk from 'chalk'
import createLogger from 'utils/logging'
import Mocha from 'mocha'

const log = createLogger('sagas/linter')
const mocha = new Mocha({reporter: 'min'})

export default function* initTestRunner() {
  log.debug('—— Test runner listening ——')
  while (true) {
    yield take(TEST)
    yield call(runTests)
    yield put(done())
    yield apply(process, process.send, workerReady(WORKER_TEST_RUNNER))
  }
}

export function* runTests() {
  log.info('—— Test runner complete ——')
}
