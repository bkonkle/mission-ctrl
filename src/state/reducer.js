import {combineReducers} from 'redux'
import foreman from './foreman'
import transpiler from 'workers/transpiler/state'
import workers from 'workers/state'

export function getReducer() {
  return combineReducers({foreman, transpiler, workers})
}
