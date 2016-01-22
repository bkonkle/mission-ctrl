import createLogger from '../utils/logging'

const log = createLogger('compiler')

export default function compiler() {
  this.postMessage({message: 'Compiler, ready and waiting!'})
  this.onmessage = event => log.info('Foreman said:', event.data)
}
