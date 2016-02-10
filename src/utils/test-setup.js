import 'babel-polyfill'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiImmutable from 'chai-immutable'
import sourceMaps from 'source-map-support'
import sinonChai from 'sinon-chai'

sourceMaps.install()

chai.use(chaiImmutable)
chai.use(chaiAsPromised)
chai.use(sinonChai)

if (!process.send) process.send = () => {}
