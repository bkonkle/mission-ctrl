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
  const middleware = [thunkMiddleware, reduxLogger]
  if (saga) middleware.push(sagaMiddleware(saga))

  return createStore(
    combineReducers({foreman, linter, transpiler, workers}),
    initialState,
    applyMiddleware(...middleware)
  )
}
