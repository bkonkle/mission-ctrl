import {applyMiddleware, createStore as reduxCreateStore} from 'redux'
import {getReducer} from './reducer'
import {reduxLogger} from 'utils/logging'
import getConfig from 'utils/config'
import sagaMiddleware from 'redux-saga'
import sagas from '../sagas'
import thunkMiddleware from 'redux-thunk'

export function createStore(initialState) {
  const config = getConfig()

  const middleware = [thunkMiddleware, sagaMiddleware(...sagas)]
  if (config.trace) middleware.push(reduxLogger)

  return applyMiddleware(...middleware)(reduxCreateStore)(getReducer(), initialState)
}
