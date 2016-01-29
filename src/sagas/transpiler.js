import {call, fork} from 'redux-saga'
import {startProcess} from 'utils/sagas'
import {transpile} from 'workers/transpiler'
import {WORKER_TRANSPILER} from 'state/workers'
import {GOAL_TRANSPILE} from 'state/foreman'
import createLogger from 'utils/logging'

const log = createLogger('sagas/transpiler')

export default function* startTranspiler() {
  yield fork(startProcess(WORKER_TRANSPILER, GOAL_TRANSPILE, runTranspiler))
}

export function* runTranspiler() {
  log.debug('—— Transpiler running ——')
  yield call(transpile)
}
