import blessed from 'blessed'
import terminus from 'terminus'

export function newWorker(stream) {
  if (!stream) throw new Error('Attempted to initialize worker without stream.')

  const worker = new blessed.Log({
    height: '99%',
    keys: true,
    left: 0,
    scrollbar: {
      fg: '#87CEFA',
      ch: '|',
    },
    top: 1,
    width: '100%',
  })

  worker.on('attach', () => {
    stream.pipe(terminus.tail(chunk => {
      worker.log(chunk.toString())
    }))
  })

  worker.on('keypress', (ch, key) => {
    const left = (
      key.name === 'left'
      || (worker.options.vi && key.name === 'h')
      || (key.shift && key.name === 'tab')
    )
    const right = (
      key.name === 'right'
      || (worker.options.vi && key.name === 'l')
      || key.name === 'tab'
    )
    const enter = (
      key.name === 'enter'
      || (worker.options.vi && key.name === 'k' && !key.shift)
    )
    const menuBar = worker.parent.children[0]

    if (left || right || enter) menuBar.emit('keypress', ch, key)
  })

  return worker
}
