'use strict';

var _chai = require('chai');

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('utils/config', function () {

  var findupStub = _sinon2.default.stub();

  var getConfig = (0, _proxyquire2.default)('./config', {
    'findup-sync': findupStub
  });

  afterEach(function () {
    findupStub.reset();
  });

  describe('getConfig()', function () {

    var expected = {
      _: [],
      outDir: 'build',
      production: false,
      quiet: false,
      silent: false,
      source: 'src/**/*.js?(x)',
      v: true,
      verbose: true
    };

    it('checks the command line for options', function () {
      var args = ['--verbose'];
      var result = getConfig(args);
      (0, _chai.expect)(result).to.deep.equal(expected);
    });

    it('checks an rc file for options', function () {
      findupStub.returns({ verbose: true });
      var result = getConfig([]);
      (0, _chai.expect)(findupStub).to.have.been.calledWith('.shipyardrc');
      (0, _chai.expect)(result).to.deep.equal(expected);
    });
  });
});
//# sourceMappingURL=config.test.js.map