import {done} from 'state/transpiler'
import {sync as glob} from 'glob'
import {call, put, take} from 'redux-saga'
import {TRANSPILE} from 'state/transpiler'
import {WORKER_TRANSPILER, workerReady} from 'state/workers'
import * as babel from 'utils/babel'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'
import path from 'path'

const log = createLogger('sagas/transpiler')

export default function* initTranspiler() {
  log.debug('—— Transpiler listening ——')
  while (true) {
    const action = yield take(TRANSPILE)
    yield call(transpile, action.payload)
  }
}

export function* transpile() {
  const config = getConfig()
  const filenames = yield call(glob, path.join(config.source, config.glob))

  yield call(babel.transpile, {
    baseDir: config.source,
    filenames,
    outDir: config.dest,
    sourceMaps: true,
  })

  log.info('—— Transpilation complete ——')

  yield put(done())
  yield call(process.send.bind(process), workerReady(WORKER_TRANSPILER))
}
