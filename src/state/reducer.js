import {combineReducers} from 'redux'
import foreman from './foreman'
import linter from 'state/linter'
import transpiler from 'state/transpiler'
import workers from 'state/workers'

export function getReducer() {
  return combineReducers({foreman, linter, transpiler, workers})
}
