import blessed from 'blessed'
import getDashboard from './dashboard'

export default function newScreen() {
  const screen = new blessed.Screen({
    autoPadding: true,
    debug: true,
    dockBorders: true,
    smartCSR: true,
    terminal: 'xterm-256color',
    title: 'control-center',
  })

  screen.key(['q', 'C-c'], () => process.exit(0))

  screen.append(getDashboard())

  screen.render()

  return screen
}
