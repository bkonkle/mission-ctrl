import {finish, start} from 'state/transpiler'
import {ready, busy, WORKER_TRANSPILER} from 'state/workers'
import {sync as glob} from 'glob'
import {transpileToDir} from 'utils/babel'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'

const log = createLogger('workers/transpiler')

export function transpile(store, worker) {
  const config = getConfig()
  const filenames = glob(config.source)

  worker.postMessage(busy(WORKER_TRANSPILER))
  store.dispatch(start())

  transpileToDir({
    outDir: config.outDir,
    sourceMaps: true,
  }, filenames)

  store.dispatch(finish())
  worker.postMessage(ready(WORKER_TRANSPILER))
}

export function handleStateChange(store) {
  const state = store.getState()
  console.log('state change!', state)
}

export default store => () => {
  store.subscribe(() => handleStateChange.bind(null, store))

  this.onmessage = event => {
    store.dispatch(event.data)
  }

  this.postMessage(ready(WORKER_TRANSPILER))

  log.debug('Transpiler process ready.')
}
