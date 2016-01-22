import compiler from './workers/compiler'
import createLogger from './utils/logging'
import Threads from 'webworker-threads'

const log = createLogger('foreman')

export function init() {
  const workers = {
    compiler: new Threads.Worker(compiler),
  }

  workers.compiler.onmessage = event => {
    log.info('Message received from the compiler:', event.data)
  }
}

if (require.main === module) {
  init()
}
