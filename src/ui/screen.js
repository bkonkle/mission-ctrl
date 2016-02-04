import {Map} from 'immutable'
import {newWorker} from './workers'
import blessed from 'blessed'
import newDashboard from './dashboard'

export default function newScreen(streams) {
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
    'Transpiler': newWorker(streams.get('transpiler')),
    'Linter': newWorker(streams.get('linter')),
    'Watcher': newWorker(streams.get('watcher')),
  })
  screen.append(newDashboard(menuItems))

  screen.render()

  return screen
}
