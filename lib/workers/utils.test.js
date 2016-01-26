'use strict';

var _chai = require('chai');

var _state = require('workers/state');

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('workers/utils', function () {

  var dispatchSpy = _sinon2.default.spy();
  var subscribeSpy = _sinon2.default.spy();

  var testUtils = (0, _proxyquire2.default)('./utils', {
    'state/store': { getStore: function getStore() {
        return {
          dispatch: dispatchSpy,
          subscribe: subscribeSpy
        };
      } }
  });

  afterEach(function () {
    dispatchSpy.reset();
    subscribeSpy.reset();
    process.on.reset();
    process.send.reset();
  });

  describe('workerInit()', function () {

    it('subscribes to state changes', function () {
      var callback = _sinon2.default.spy();
      testUtils.workerInit(_state.WORKER_TRANSPILER, callback)();
      (0, _chai.expect)(subscribeSpy).to.have.been.calledOnce;
    });

    it('dispatches actions from parent process messages', function () {
      var callback = _sinon2.default.spy();
      var message = { type: 'ship-yard/utils/TEST' };

      testUtils.workerInit(_state.WORKER_TRANSPILER, callback)();

      (0, _chai.expect)(process.on).to.have.been.called;
      var cb = process.on.firstCall.args[1];
      cb(message);

      (0, _chai.expect)(dispatchSpy).to.have.been.calledWith(message);
    });

    it('sends a ready message back to the parent process', function () {
      testUtils.workerInit(_state.WORKER_TRANSPILER, function () {})();
      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _state.workerReady)(_state.WORKER_TRANSPILER));
    });
  });
});
//# sourceMappingURL=utils.test.js.map