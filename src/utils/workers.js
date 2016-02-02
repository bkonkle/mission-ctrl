import 'babel-polyfill'
import {initialState as workers, workerReady} from 'state/workers'
import {initialState} from 'state/workers'
import {Map} from 'immutable'
import {newStore} from 'state/store'
import childProcess from 'child_process'
import createLogger from 'utils/logging'
import findup from 'findup-sync'
import getConfig from 'utils/config'
import Module from 'module'
import path from 'path'
import slug from 'slug'
import through from 'through2'

const log = createLogger('utils/workers')

export const workerInit = (worker, saga, storeOverride) => {
  const config = getConfig()
  const store = storeOverride || newStore(saga)

  const nodeModules = findup('node_modules', {cwd: path.resolve(config.source)})
  if (nodeModules) {
    process.env.NODE_PATH = `${process.env.NODE_PATH}:${nodeModules}`
    Module._initPaths()
  }

  process.on('message', message => {
    log.debug(`Message received for the ${initialState.getIn([worker, 'name'])}: ${message.type}`)
    store.dispatch(message)
  })

  process.send(workerReady(worker))

  log.debug(`—— ${initialState.getIn([worker, 'name'])} successfully initialized ——`)
}

export function forkWorker(worker) {
  const workerPath = path.resolve(
    path.join(path.dirname(__dirname), 'init.js')
  )
  return childProcess.fork(workerPath, [worker, ...process.argv.slice(2), '--color'], {
    env: {NODE_PATH: `${process.env.NODE_PATH}:${path.dirname(__dirname)}`},
    silent: true,
  })
}

export const streams = workers.reduce((memo, worker) => {
  return memo.set(slug(worker.get('name'), {lower: true}), through())
}, new Map())
