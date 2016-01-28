import {combineReducers} from 'redux'
import foreman from './foreman'
import linter from 'workers/linter/state'
import transpiler from 'workers/transpiler/state'
import watcher from 'workers/watcher/state'
import workers from 'state/workers'

export function getReducer() {
  return combineReducers({foreman, linter, transpiler, workers, watcher})
}
