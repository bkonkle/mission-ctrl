import 'babel-polyfill'
import {getStore} from 'state/store'
import {workerReady} from 'state/workers'
import childProcess from 'child_process'
import createLogger from 'utils/logging'
import findup from 'findup-sync'
import getConfig from 'utils/config'
import Module from 'module'
import path from 'path'

const log = createLogger('utils/workers')

export const workerInit = worker => () => {
  const config = getConfig()
  const store = getStore()

  const nodeModules = findup('node_modules', {cwd: path.resolve(config.source)})
  if (nodeModules) {
    process.env.NODE_PATH = `${process.env.NODE_PATH}:${nodeModules}`
    Module._initPaths()
  }

  process.on('message', message => {
    log.debug(`Message received for ${worker}: ${message.type}`)
    store.dispatch(message)
  })

  process.send(workerReady(worker))

  log.debug(`Worker ${worker} successfully initialized`)
}

export function forkWorker(worker) {
  const workerPath = path.resolve(
    path.join(path.dirname(__dirname), 'workers', `${worker}.js`)
  )
  return childProcess.fork(workerPath, [...process.argv.slice(2), '--color'], {
    env: {NODE_PATH: `${process.env.NODE_PATH}:${path.dirname(__dirname)}`},
  })
}
