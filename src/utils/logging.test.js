import {expect} from 'chai'
import bunyan from 'bunyan'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/logging', () => {
  const createLoggerSpy = sinon.spy()
  const getConfigStub = sinon.stub()

  const logging = proxyquire('./logging', {
    './config': getConfigStub,
    'bunyan': {createLogger: createLoggerSpy},
  })
  const createLogger = logging.default
  const PlainStream = logging.PlainStream

  const origEnv = process.env.NODE_ENV

  beforeEach(() => {
    process.env.NODE_ENV = 'development'
    createLoggerSpy.reset()
    getConfigStub.reset()
  })

  after(() => {
    process.env.NODE_ENV = origEnv
  })

  describe('createLogger()', () => {

    it('sets the loglevel to "info"', () => {
      getConfigStub.returns({verbose: false})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', bunyan.INFO)
    })

    it('sets the loglevel to "debug" if config.verbose', () => {
      getConfigStub.returns({verbose: true})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', bunyan.DEBUG)
    })

    it('sets the loglevel to "warning" if config.quiet', () => {
      getConfigStub.returns({quiet: true})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', bunyan.WARN)
    })

    it('sets the loglevel to "error" if config.silent', () => {
      getConfigStub.returns({silent: true})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', bunyan.ERROR)
    })

    it('sets the loglevel to "warn" if the NODE_ENV is "test"', () => {
      process.env.NODE_ENV = 'test'
      getConfigStub.returns({verbose: false})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', bunyan.WARN)
    })

    it('uses the PlainStream by default', () => {
      getConfigStub.returns({verbose: false})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams')
        .and.have.length(1)
      expect(result.streams[0]).to.have.property('stream')
        .and.be.an.instanceof(PlainStream)
    })

  })

  describe('reduxLogger', () => {

    it('logs actions that are dispatched to the redux store')

  })

})
