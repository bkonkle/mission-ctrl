'use strict';

var _chai = require('chai');

var _test = require('utils/test');

var _workers = require('state/workers');

var _foreman = require('state/foreman');

var _proxyquire2 = require('proxyquire');

var _proxyquire3 = _interopRequireDefault(_proxyquire2);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('foreman', function () {

  var forkStub = _sinon2.default.stub();

  var _proxyquire = (0, _proxyquire3.default)('./foreman', {
    'child_process': { fork: forkStub }
  });

  var init = _proxyquire.init;

  afterEach(function () {
    forkStub.reset();
  });

  describe('init()', function () {

    var callback = undefined;

    before(function () {
      forkStub.returns({
        on: function on(event, cb) {
          callback = cb;
        }
      });
    });

    it('spawns a transpiler worker', function () {
      init();
      (0, _chai.expect)(forkStub).to.have.been.calledWith(require.resolve('workers/transpiler'));
    });

    it('dispatches actions from worker messages', function (done) {
      var store = (0, _test.mockStore)({}, [(0, _foreman.setGoal)(_foreman.GOAL_TRANSPILE), (0, _workers.ready)('transpiler')], done);

      store.subscribe = function () {};

      init(store);

      callback((0, _workers.ready)('transpiler'));
    });
  });
});
//# sourceMappingURL=foreman.test.js.map