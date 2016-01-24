import {getStore} from 'state/store'
import {ready, busy, WORKER_TRANSPILER} from 'state/workers'
import {sync as glob} from 'glob'
import {transpileToDir} from 'utils/babel'
import * as transpiler from 'state/transpiler'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'

const log = createLogger('workers/transpiler')

export function init() {
  const store = getStore()

  store.subscribe(() => stateChanged.bind(null, store))

  process.on('message', message => {
    log.debug('Message received:', message.type)
    store.dispatch(message)
  })

  process.send(ready(WORKER_TRANSPILER))

  log.debug('Successfully initialized')
}

export function transpile(store) {
  const config = getConfig()
  const filenames = glob(config.source)

  process.send(busy(WORKER_TRANSPILER))
  store.dispatch(transpiler.started())

  transpileToDir({
    outDir: config.outDir,
    sourceMaps: true,
  }, filenames)

  store.dispatch(transpiler.finish())
  process.send(ready(WORKER_TRANSPILER))
}

export function stateChanged(store) {
  const state = store.getState()

  switch (state.transpiler.get('status')) {
    case transpiler.STATUS_STARTING:
      transpile(store)
      break
    case transpiler.STATUS_IN_PROGRESS:
      throw new Error('Not sure if this can ever happen... now you know!')
    default:
      // Do nothing
  }
}

init()
