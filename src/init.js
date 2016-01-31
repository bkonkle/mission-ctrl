import 'babel-polyfill'
import {newStore} from 'state/store'
import createLogger from 'utils/logging'
import startForeman from 'sagas/foreman'

const log = createLogger('init')

export default function init() {
  newStore(startForeman)
  log.debug('—— Ship Yard successfully initialized ——')
}
