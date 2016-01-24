import {combineReducers} from 'redux'
import foreman from './foreman'
import transpiler from './transpiler'
import workers from './workers'

export function getReducer() {
  return combineReducers({foreman, transpiler, workers})
}
