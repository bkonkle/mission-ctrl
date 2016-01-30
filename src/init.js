import 'babel-polyfill'
import {newStore} from 'state/store'
import {setGoal, GOAL_WATCH} from 'state/foreman'
import createLogger from 'utils/logging'
import startForeman from 'sagas/foreman'

const log = createLogger('init')

export default function init(storeOverride) {
  const store = storeOverride || newStore(startForeman)
  log.debug('—— Ship Yard successfully initialized ——')
  store.dispatch(setGoal(GOAL_WATCH))
  process.stdin.resume()
}
