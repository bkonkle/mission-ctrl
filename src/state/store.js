import {applyMiddleware, createStore} from 'redux'
import {getReducer} from './reducer'
import {reduxLogger} from 'utils/logging'
import getConfig from 'utils/config'
import thunkMiddleware from 'redux-thunk'

export function getStore(initialState) {
  const config = getConfig()

  const middleware = [thunkMiddleware]
  if (config.trace) middleware.push(reduxLogger)

  return applyMiddleware(...middleware)(createStore)(getReducer(), initialState)
}
