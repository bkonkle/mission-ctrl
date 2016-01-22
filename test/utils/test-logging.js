import {expect} from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/logging', () => {

  const createLoggerSpy = sinon.spy()
  const getConfigStub = sinon.stub()

  const logging = proxyquire('../../src/utils/logging', {
    './config': getConfigStub,
    'bunyan': {createLogger: createLoggerSpy},
  })
  const createLogger = logging.default
  const PlainStream = logging.PlainStream

  afterEach(() => {
    createLoggerSpy.reset()
    getConfigStub.reset()
  })

  describe('createLogger()', () => {

    it('sets the loglevel to "info"', () => {
      getConfigStub.returns({verbose: false})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', 'info')
    })

    it('sets the loglevel to "debug" if config.verbose', () => {
      getConfigStub.returns({verbose: true})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', 'debug')
    })

    it('sets the loglevel to "warning" if config.quiet', () => {
      getConfigStub.returns({quiet: true})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', 'warning')
    })

    it('sets the loglevel to "error" if config.silent', () => {
      getConfigStub.returns({silent: true})

      createLogger('test-logging')

      expect(createLoggerSpy).to.have.been.calledOnce
      const result = createLoggerSpy.firstCall.args[0]

      expect(result).to.have.property('streams').and.have.length(1)
      expect(result.streams[0]).to.have.property('level', 'error')
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

})
