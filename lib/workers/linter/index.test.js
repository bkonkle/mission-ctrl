'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _foreman = require('state/foreman');

var _state = require('workers/linter/state');

var _test = require('utils/test');

var _state2 = require('workers/state');

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('workers/linter', function () {

  var linterStub = _sinon2.default.spy();

  var linter = (0, _proxyquire2.default)('./index', {
    'eslint': { CLIEngine: function CLIEngine() {
        return { executeOnFiles: linterStub };
      } }
  });

  beforeEach(function () {
    linterStub.reset();
  });

  describe('lint()', function () {

    it('updates status before and after', function (done) {
      var expectedActions = [(0, _state.inProgress)(true), (0, _state.inProgress)(false)];
      var store = (0, _test.mockStore)({}, expectedActions, done);

      linter.lint(store);

      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _state2.workerBusy)(_state2.WORKER_LINTER));
      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _state2.workerReady)(_state2.WORKER_LINTER));
    });

    it('runs linter.executeOnFiles on the source directory');

    it('reports the results in a log grouped by file');
  });

  describe('stateChanged()', function () {

    describe('GOAL_LINT', function () {

      it('runs the linter', function () {
        var store = {
          dispatch: function dispatch() {},
          getState: function getState() {
            return {
              linter: (0, _immutable.fromJS)({ goal: _foreman.GOAL_LINT, inProgress: false })
            };
          }
        };

        linter.stateChanged(store);

        (0, _chai.expect)(linterStub).to.have.been.calledWith(['src']);
      });
    });
  });
});
//# sourceMappingURL=index.test.js.map