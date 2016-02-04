import blessed from 'blessed'
import terminus from 'terminus'

export function newWorker(stream) {
  if (!stream) throw new Error('Attempted to initialize worker without stream.')

  const worker = new blessed.Log({
    height: '99%',
    left: 0,
    top: 1,
    width: '100%',
  })

  worker.on('attach', () => stream.pipe(terminus.tail(chunk => {
    worker.log(chunk.toString())
  })))

  return worker
}
