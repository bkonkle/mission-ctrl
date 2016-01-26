'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _test = require('utils/test');

var _linter = require('state/linter');

var _transpiler = require('state/transpiler');

var _foreman = require('state/foreman');

var _workers = require('state/workers');

var workers = _interopRequireWildcard(_workers);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('foreman', function () {

  var forkStub = _sinon2.default.stub();

  var foreman = (0, _proxyquire2.default)('./foreman', {
    'child_process': { fork: forkStub }
  });

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
      foreman.init();
      (0, _chai.expect)(forkStub).to.have.been.calledWith(require.resolve('workers/transpiler'));
    });

    it('dispatches actions from worker messages', function (done) {
      var store = (0, _test.mockStore)({}, [(0, _foreman.setGoal)(_foreman.GOAL_TRANSPILE), workers.workerReady('transpiler')], done);
      store.subscribe = function () {};

      foreman.init(store);

      callback(workers.workerReady('transpiler'));
    });

    it('subscribes to state changes', function (done) {
      var store = (0, _test.mockStore)({}, [(0, _foreman.setGoal)(_foreman.GOAL_TRANSPILE)], done);

      store.subscribe = _sinon2.default.spy();

      foreman.init(store);

      (0, _chai.expect)(store.subscribe).to.have.been.calledOnce;
      (0, _chai.expect)(store.subscribe.firstCall.args[0]).to.have.property('name', 'bound stateChanged');
    });

    it('dispatches an initial GOAL_TRANSPILE', function (done) {
      var store = (0, _test.mockStore)({}, [(0, _foreman.setGoal)(_foreman.GOAL_TRANSPILE)], done);
      store.subscribe = function () {};

      foreman.init(store);
    });
  });

  describe('forkWorker()', function () {

    it('calls child_process.fork on the requested worker', function () {
      var worker = {};
      var workerName = 'whip-creamer';
      var workerPath = _path2.default.resolve(_path2.default.join(__dirname, 'workers', workerName + '.js'));
      forkStub.returns(worker);

      var result = foreman.forkWorker(workerName);

      (0, _chai.expect)(forkStub).to.be.calledWith(workerPath);
      (0, _chai.expect)(result).to.equal(worker);
    });
  });

  describe('stateChanged()', function () {

    it('throws an error if there is no goal', function () {
      var _processes;

      var sendSpy = _sinon2.default.spy();
      var store = { getState: function getState() {
          return { foreman: (0, _immutable.fromJS)({ goal: null }) };
        } };
      var processes = (_processes = {}, _processes[workers.WORKER_TRANSPILER] = { send: sendSpy }, _processes);

      (0, _chai.expect)(function () {
        return foreman.stateChanged(store, processes);
      }).to.throw(Error);
    });

    it('starts transpilation if that is the goal', function () {
      var _processes2;

      var sendSpy = _sinon2.default.spy();
      var store = { getState: function getState() {
          var _fromJS;

          return {
            foreman: (0, _immutable.fromJS)({ goal: _foreman.GOAL_TRANSPILE }),
            workers: (0, _immutable.fromJS)((_fromJS = {}, _fromJS[workers.WORKER_TRANSPILER] = { status: workers.READY }, _fromJS))
          };
        } };
      var processes = (_processes2 = {}, _processes2[workers.WORKER_TRANSPILER] = { send: sendSpy }, _processes2);

      foreman.stateChanged(store, processes);

      (0, _chai.expect)(sendSpy).to.be.calledWith((0, _transpiler.setGoal)(_foreman.GOAL_TRANSPILE));
    });

    it('starts linting if transpilation is done', function () {
      var _processes3;

      var sendSpy = _sinon2.default.spy();
      var store = { getState: function getState() {
          var _fromJS2;

          return {
            foreman: (0, _immutable.fromJS)({ goal: _foreman.GOAL_LINT }),
            workers: (0, _immutable.fromJS)((_fromJS2 = {}, _fromJS2[workers.WORKER_LINTER] = { status: workers.READY }, _fromJS2))
          };
        } };
      var processes = (_processes3 = {}, _processes3[workers.WORKER_LINTER] = { send: sendSpy }, _processes3);

      foreman.stateChanged(store, processes);

      (0, _chai.expect)(sendSpy).to.be.calledWith((0, _linter.setGoal)(_foreman.GOAL_LINT));
    });
  });
});
//# sourceMappingURL=foreman.test.js.map