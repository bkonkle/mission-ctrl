import configureStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'

export function mockStore(...args) {
  return configureStore([thunkMiddleware])(...args)
}
