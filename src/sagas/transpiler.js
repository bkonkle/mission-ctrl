import {apply, call, put, take} from 'redux-saga'
import {done} from 'state/transpiler'
import {sync as glob} from 'glob'
import {tmp} from 'utils/fs'
import {TRANSPILE} from 'state/transpiler'
import {WORKER_TRANSPILER, workerDone} from 'state/workers'
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
  log.info('—— Transpile starting ——')
  const config = getConfig()
  const filenames = yield call(glob, path.join(config.source, config.glob))

  log.debug('Destination:', tmp(config.dest))

  yield call(babel.transpile, {
    baseDir: config.source,
    filenames,
    outDir: tmp(config.dest),
    sourceMaps: true,
  })

  log.info('—— Transpile complete ——')

  yield put(done())
  yield apply(process, process.send, [workerDone(WORKER_TRANSPILER)])
}
