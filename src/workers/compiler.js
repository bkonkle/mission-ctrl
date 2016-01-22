import {ready} from 'state/workers'
import createLogger from 'utils/logging'

const log = createLogger('compiler')

export default function compiler() {
  this.postMessage(ready('compiler'))
  this.onmessage = event => log.info('Foreman said:', event.data)
}
