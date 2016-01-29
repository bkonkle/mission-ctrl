import 'babel-polyfill'
import {createStore} from 'state/store'
import {setGoal, GOAL_WATCH} from 'state/foreman'

export default function init(storeOverride) {
  const store = storeOverride || createStore()
  store.dispatch(setGoal(GOAL_WATCH))
  process.stdin.resume()
}
