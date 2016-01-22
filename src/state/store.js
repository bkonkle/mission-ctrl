import {applyMiddleware, createStore} from 'redux'
import {getReducer} from './reducer'
import thunkMiddleware from 'redux-thunk'

export function getStore(initialState) {
  const middleware = [thunkMiddleware]
  return applyMiddleware(...middleware)(createStore)(getReducer(), initialState)
}
