'use strict';

var _chai = require('chai');

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('utils/logging', function () {

  var createLoggerSpy = _sinon2.default.spy();
  var getConfigStub = _sinon2.default.stub();

  var logging = (0, _proxyquire2.default)('./logging', {
    './config': getConfigStub,
    'bunyan': { createLogger: createLoggerSpy }
  });
  var createLogger = logging.default;
  var PlainStream = logging.PlainStream;

  beforeEach(function () {
    createLoggerSpy.reset();
    getConfigStub.reset();
  });

  describe('createLogger()', function () {

    it('sets the loglevel to "info"', function () {
      getConfigStub.returns({ verbose: false });

      createLogger('test-logging');

      (0, _chai.expect)(createLoggerSpy).to.have.been.calledOnce;
      var result = createLoggerSpy.firstCall.args[0];

      (0, _chai.expect)(result).to.have.property('streams').and.have.length(1);
      (0, _chai.expect)(result.streams[0]).to.have.property('level', _bunyan2.default.INFO);
    });

    it('sets the loglevel to "debug" if config.verbose', function () {
      getConfigStub.returns({ verbose: true });

      createLogger('test-logging');

      (0, _chai.expect)(createLoggerSpy).to.have.been.calledOnce;
      var result = createLoggerSpy.firstCall.args[0];

      (0, _chai.expect)(result).to.have.property('streams').and.have.length(1);
      (0, _chai.expect)(result.streams[0]).to.have.property('level', _bunyan2.default.DEBUG);
    });

    it('sets the loglevel to "warning" if config.quiet', function () {
      getConfigStub.returns({ quiet: true });

      createLogger('test-logging');

      (0, _chai.expect)(createLoggerSpy).to.have.been.calledOnce;
      var result = createLoggerSpy.firstCall.args[0];

      (0, _chai.expect)(result).to.have.property('streams').and.have.length(1);
      (0, _chai.expect)(result.streams[0]).to.have.property('level', _bunyan2.default.WARN);
    });

    it('sets the loglevel to "error" if config.silent', function () {
      getConfigStub.returns({ silent: true });

      createLogger('test-logging');

      (0, _chai.expect)(createLoggerSpy).to.have.been.calledOnce;
      var result = createLoggerSpy.firstCall.args[0];

      (0, _chai.expect)(result).to.have.property('streams').and.have.length(1);
      (0, _chai.expect)(result.streams[0]).to.have.property('level', _bunyan2.default.ERROR);
    });

    it('uses the PlainStream by default', function () {
      getConfigStub.returns({ verbose: false });

      createLogger('test-logging');

      (0, _chai.expect)(createLoggerSpy).to.have.been.calledOnce;
      var result = createLoggerSpy.firstCall.args[0];

      (0, _chai.expect)(result).to.have.property('streams').and.have.length(1);
      (0, _chai.expect)(result.streams[0]).to.have.property('stream').and.be.an.instanceof(PlainStream);
    });
  });
});
//# sourceMappingURL=logging.test.js.map