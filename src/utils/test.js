import 'babel-polyfill'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiImmutable from 'chai-immutable'
import configureStore from 'redux-mock-store'
import sourceMaps from 'source-map-support'
import sinonChai from 'sinon-chai'
import thunkMiddleware from 'redux-thunk'

sourceMaps.install()

chai.use(chaiImmutable)
chai.use(chaiAsPromised)
chai.use(sinonChai)

if (!process.send) process.send = () => {}

export function mockStore(...args) {
  return configureStore([thunkMiddleware])(...args)
}
