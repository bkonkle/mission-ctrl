import {sourceChanged} from 'state/foreman'
import {WORKER_WATCHER, workerDone} from 'state/workers'
import {workerInit} from 'utils/workers'
import chalk from 'chalk'
import chokidar from 'chokidar'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'
import path from 'path'

const log = createLogger('workers/watcher')

export function init() {
  workerInit(WORKER_WATCHER)()
  watch()
}

export function watch() {
  const config = getConfig()

  chokidar.watch(path.join(config.source, config.glob), {ignoreInitial: true})
    .on('all', reportChange)

  log.info('—— Watcher started ——')

  process.send(workerDone(WORKER_WATCHER))
}

export function reportChange(event, file, info = log.info.bind(log)) {
  info(`${chalk.yellow(event)} --> ${file}`)
  process.send(sourceChanged())
}

if (require.main === module) {
  init()
}
