import {combineReducers} from 'redux'
import foreman from './foreman'
import linter from 'workers/linter/state'
import transpiler from 'workers/transpiler/state'
import workers from 'workers/state'

export function getReducer() {
  return combineReducers({foreman, linter, transpiler, workers})
}
