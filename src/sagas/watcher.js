import {apply, call} from 'redux-saga'
import {sourceChanged} from 'state/foreman'
import chalk from 'chalk'
import chokidar from 'chokidar'
import createLogger from 'utils/logging'
import getConfig from 'utils/config'
import path from 'path'

const log = createLogger('workers/watcher')

export default function* initWatcher() {
  yield call(watch)
}

export function* watch() {
  const config = getConfig()

  const watcher = yield call(
    chokidar.watch,
    path.join(config.source, config.glob),
    {ignoreInitial: true}
  )
  yield call(watcher.on, 'all', reportChange)

  log.info('—— Watcher started ——')
}

export function* reportChange(event, file, info = log.info.bind(log)) {
  yield call(info, `${chalk.yellow(event)} --> ${file}`)
  yield apply(process, process.send, sourceChanged(file))
}
