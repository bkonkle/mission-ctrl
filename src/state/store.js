import {applyMiddleware, createStore} from 'redux'
import {combineReducers} from 'redux'
import {reduxLogger} from 'utils/logging'
import foreman from './foreman'
import linter from 'state/linter'
import sagaMiddleware from 'redux-saga'
import thunkMiddleware from 'redux-thunk'
import transpiler from 'state/transpiler'
import workers from 'state/workers'

export function newStore(saga, initialState) {
  return createStore(
    combineReducers({foreman, linter, transpiler, workers}),
    initialState,
    applyMiddleware(
      thunkMiddleware,
      sagaMiddleware(saga),
      reduxLogger
    )
  )
}
