'use strict';

var _workers = require('state/workers');

var _chai = require('chai');

var _immutable = require('immutable');

var _test = require('utils/test');

var _transpiler = require('state/transpiler');

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('workers/transpiler', function () {
  var dispatchSpy = _sinon2.default.spy();
  var subscribeSpy = _sinon2.default.spy();
  var transpileSpy = _sinon2.default.spy();

  var transpiler = (0, _proxyquire2.default)('./transpiler', {
    'state/store': { getStore: function getStore() {
        return {
          dispatch: dispatchSpy,
          subscribe: subscribeSpy
        };
      } },
    'utils/babel': { transpileToDir: transpileSpy }
  });

  afterEach(function () {
    dispatchSpy.reset();
    subscribeSpy.reset();
    transpileSpy.reset();
    process.on.reset();
    process.send.reset();
  });

  describe('init', function () {

    it('subscribes to state changes', function () {
      transpiler.init();
      (0, _chai.expect)(subscribeSpy).to.have.been.calledOnceÎ;
    });

    it('dispatches actions from parent process messages', function () {
      var message = 'Test message';

      transpiler.init();

      (0, _chai.expect)(process.on).to.have.been.calledOnce;

      var callback = process.on.firstCall.args[1];
      callback(message);

      (0, _chai.expect)(dispatchSpy).to.have.been.calledWith(message);
    });

    it('sends a ready message back to the parent process', function () {
      transpiler.init();
      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _workers.ready)(_workers.WORKER_TRANSPILER));
    });
  });

  describe('transpile()', function () {

    it('reports status to the worker and updates internal status', function (done) {
      var expectedActions = [(0, _transpiler.started)(), (0, _transpiler.finish)()];
      var store = (0, _test.mockStore)({}, expectedActions, done);

      transpiler.transpile(store);

      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _workers.busy)(_workers.WORKER_TRANSPILER));
      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _workers.ready)(_workers.WORKER_TRANSPILER));
    });
  });

  describe('stateChanged()', function () {

    describe('STATUS_STARTING', function () {

      it('runs a transpile', function () {
        var store = {
          dispatch: function dispatch() {},
          getState: function getState() {
            return {
              transpiler: (0, _immutable.fromJS)({ status: _transpiler.STATUS_STARTING })
            };
          }
        };

        transpiler.stateChanged(store);

        (0, _chai.expect)(transpileSpy).to.have.been.calledOnce;
      });

      it('dispatches a STARTED event', function (done) {
        var initialState = { transpiler: (0, _immutable.fromJS)({ status: _transpiler.STATUS_STARTING }) };
        var expectedActions = [(0, _transpiler.started)(), (0, _transpiler.finish)()];
        var store = (0, _test.mockStore)(initialState, expectedActions, done);

        transpiler.stateChanged(store);

        (0, _chai.expect)(transpileSpy).to.have.been.calledOnce;
      });
    });
  });
});
//# sourceMappingURL=transpiler.test.js.map