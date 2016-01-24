import {finish, start} from 'state/transpiler'
import {getStore} from 'state/store'
import {ready, busy, WORKER_TRANSPILER} from 'state/workers'
import {sync as glob} from 'glob'
import {transpileToDir} from 'utils/babel'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'

const log = createLogger('workers/transpiler')

function init() {
  log.debug('Transpiler initializing')

  const store = getStore()

  store.subscribe(() => handleStateChange.bind(null, store))

  process.on('message', message => {
    log.debug('Message received!', message)
    store.dispatch(message)
  })

  process.send(ready(WORKER_TRANSPILER))

  log.debug('Transpiler successfully initialized')
}

export function handleStateChange(store) {
  const state = store.getState()
  log.debug('State changed', state)
}

export function transpile(store) {
  const config = getConfig()
  const filenames = glob(config.source)

  process.send(busy(WORKER_TRANSPILER))
  store.dispatch(start())

  transpileToDir({
    outDir: config.outDir,
    sourceMaps: true,
  }, filenames)

  store.dispatch(finish())
  process.send(ready(WORKER_TRANSPILER))
}

init()
