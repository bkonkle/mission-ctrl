'use strict';

var _chai = require('chai');

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('utils/babel', function () {
  var dest = '/test/build/file.js';
  var filenames = ['/test/src/file.js', '/test/src/file.test.js'];
  var options = { baseDir: '/test/src', filenames: filenames, outDir: '/test/build' };
  var codeEs6 = 'const CODE = "CODE"';
  var codeEs5 = 'var CODE = "CODE"';

  var chmodSpy = _sinon2.default.spy();
  var outputSpy = _sinon2.default.spy();
  var readFileStub = _sinon2.default.stub().returns(codeEs6);
  var statStub = _sinon2.default.stub().returns({ mode: 'test' });
  var transformStub = _sinon2.default.stub().returns({ code: codeEs5 });

  var babelUtils = (0, _proxyquire2.default)('./babel', {
    'babel-core': { transformFileSync: transformStub },
    'fs': { chmodSync: chmodSpy, readFileSync: readFileStub, statSync: statStub },
    'utils/fs': { outputToMemFs: outputSpy }
  });

  afterEach(function () {
    chmodSpy.reset();
    outputSpy.reset();
    readFileStub.reset();
    statStub.reset().returns({ mode: 'test' });
    transformStub.reset().returns({ code: codeEs5 });
  });

  describe('transpile()', function () {

    it('calls transformFileSync() with an appropriate source file and map target', function () {
      babelUtils.transpile(options);

      (0, _chai.expect)(transformStub).to.have.been.calledTwice;

      var args = transformStub.firstCall.args;
      (0, _chai.expect)(args[0]).to.equal('/test/src/file.js');
      (0, _chai.expect)(args[1]).to.have.property('sourceFileName', '../src/file.js');
      (0, _chai.expect)(args[1]).to.have.property('sourceMapTarget', 'file.js');
    });

    it('calls outputFileSync with the results', function () {
      babelUtils.transpile(options);

      (0, _chai.expect)(outputSpy).to.have.callCount(4);
      (0, _chai.expect)(outputSpy).to.have.been.calledWith(dest, codeEs5 + '\n//# sourceMappingURL=file.js.map');
    });
  });
});
//# sourceMappingURL=babel.test.js.map