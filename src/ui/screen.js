import {Map} from 'immutable'
import {newWorker} from './workers'
import {streams} from 'utils/workers'
import blessed from 'blessed'
import newDashboard from './dashboard'

export default function init() {
  const screen = new blessed.Screen({
    autoPadding: true,
    debug: true,
    dockBorders: true,
    smartCSR: true,
    terminal: 'xterm-256color',
    title: 'control-center',
  })

  screen.key(['q', 'C-c'], () => process.exit(0))

  const menuItems = new Map({
    'Foreman': newWorker(streams.get('foreman')),
    'Watcher': newWorker(streams.get('watcher')),
    'Transpiler': newWorker(streams.get('transpiler')),
    'Linter': newWorker(streams.get('linter')),
    'Tests': newWorker(streams.get('test-runner')),
  })

  screen.append(newDashboard(menuItems))

  screen.render()

  return screen
}
