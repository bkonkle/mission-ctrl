import {call, put, take} from 'redux-saga'
import {done, LINT} from 'state/linter'
import {lint} from 'workers/linter'
import {WORKER_LINTER, workerDone} from 'state/workers'
import createLogger from 'utils/logging'

const log = createLogger('sagas/linter')

export default function* initLinter() {
  log.debug('—— Linter listening ——')
  while (true) {
    yield take(LINT)
    yield call(lint)
    yield put(done())
    process.send(workerDone(WORKER_LINTER))
  }
}
