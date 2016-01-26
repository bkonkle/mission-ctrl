'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _foreman = require('state/foreman');

var _state = require('workers/transpiler/state');

var _test = require('utils/test');

var _state2 = require('workers/state');

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('workers/transpiler', function () {
  var dispatchSpy = _sinon2.default.spy();
  var globStub = _sinon2.default.stub();
  var initSpy = _sinon2.default.spy();
  var subscribeSpy = _sinon2.default.spy();
  var transpileSpy = _sinon2.default.spy();
  var storeSpy = { dispatch: dispatchSpy, subscribe: subscribeSpy };

  var transpiler = (0, _proxyquire2.default)('./index', {
    'glob': { sync: globStub },
    'state/store': { getStore: function getStore() {
        return storeSpy;
      } },
    'utils/babel': { transpileToDir: transpileSpy },
    'workers/utils': { workerInit: initSpy }
  });

  beforeEach(function () {
    dispatchSpy.reset();
    globStub.reset().returns(['src/spike.js', 'src/lee.js']);
    initSpy.reset();
    subscribeSpy.reset();
    transpileSpy.reset();
    process.on.reset();
    process.send.reset();
  });

  describe('transpile()', function () {

    it('reports status to the worker and updates internal status', function (done) {
      var expectedActions = [(0, _state.inProgress)(true), (0, _state.inProgress)(false)];
      var store = (0, _test.mockStore)({}, expectedActions, done);

      transpiler.transpile(store);

      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _state2.workerBusy)(_state2.WORKER_TRANSPILER));
      (0, _chai.expect)(process.send).to.have.been.calledWith((0, _state2.workerReady)(_state2.WORKER_TRANSPILER));
    });

    it('calls transpileToDir with the appropriate arguments', function (done) {
      var expectedActions = [(0, _state.inProgress)(true), (0, _state.inProgress)(false)];
      var store = (0, _test.mockStore)({}, expectedActions, done);

      transpiler.transpile(store);

      (0, _chai.expect)(transpileSpy).to.have.been.calledWith({
        baseDir: 'src',
        filenames: ['src/spike.js', 'src/lee.js'],
        outDir: 'build',
        sourceMaps: true
      });
    });
  });

  describe('stateChanged()', function () {

    describe('GOAL_TRANSPILE', function () {

      it('runs a transpile', function () {
        var store = {
          dispatch: function dispatch() {},
          getState: function getState() {
            return {
              transpiler: (0, _immutable.fromJS)({ goal: _foreman.GOAL_TRANSPILE, inProgress: false })
            };
          }
        };

        transpiler.stateChanged(store);

        (0, _chai.expect)(transpileSpy).to.have.been.calledOnce;
      });
    });
  });
});
//# sourceMappingURL=index.test.js.map