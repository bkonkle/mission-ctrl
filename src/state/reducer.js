import {combineReducers} from 'redux'
import workers from './workers'

export function getReducer() {
  return combineReducers({workers})
}
