'use strict';

var _chai = require('chai');

var _test = require('utils/test');

var _workers = require('state/workers');

var _transpiler = require('state/transpiler');

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('workers/transpiler', function () {

  var transpileSpy = _sinon2.default.spy();

  var transpiler = (0, _proxyquire2.default)('./transpiler', {
    'utils/babel': { transpileToDir: transpileSpy }
  });

  afterEach(function () {
    transpileSpy.reset();
    process.on.reset();
    process.send.reset();
  });

  describe('transpile()', function () {

    it('reports status to the worker and updates internal status', function (done) {
      var expectedActions = [(0, _transpiler.start)(), (0, _transpiler.finish)()];
      var store = (0, _test.mockStore)({}, expectedActions, done);

      transpiler.transpile(store);

      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _workers.busy)(_workers.WORKER_TRANSPILER));
      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _workers.ready)(_workers.WORKER_TRANSPILER));
    });
  });
});
//# sourceMappingURL=transpiler.test.js.map