'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _test = require('utils/test');

var _workers3 = require('state/workers');

var _foreman = require('state/foreman');

var _transpiler = require('state/transpiler');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      var store = (0, _test.mockStore)({}, [(0, _foreman.setGoal)(_foreman.GOAL_TRANSPILE), (0, _workers3.ready)('transpiler')], done);
      store.subscribe = function () {};

      foreman.init(store);

      callback((0, _workers3.ready)('transpiler'));
    });

    it('subscribes to state changes', function (done) {
      var store = (0, _test.mockStore)({}, [(0, _foreman.setGoal)(_foreman.GOAL_TRANSPILE)], done);

      store.subscribe = _sinon2.default.spy();

      foreman.init(store);

      (0, _chai.expect)(store.subscribe).to.have.been.calledOnce;
      (0, _chai.expect)(store.subscribe.firstCall.args[0]).to.have.property('name', 'bound handleStateChange');
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

  describe('handleStateChange()', function () {

    it('throws an error if there is no goal', function () {
      var _workers;

      var sendSpy = _sinon2.default.spy();
      var store = { getState: function getState() {
          return { foreman: (0, _immutable.fromJS)({ goal: null }) };
        } };
      var workers = (_workers = {}, _workers[_workers3.WORKER_TRANSPILER] = { send: sendSpy }, _workers);

      (0, _chai.expect)(function () {
        return foreman.handleStateChange(store, workers);
      }).to.throw(Error);
    });

    it('starts transpilation if that is the goal', function () {
      var _workers2;

      var sendSpy = _sinon2.default.spy();
      var store = { getState: function getState() {
          var _fromJS;

          return {
            foreman: (0, _immutable.fromJS)({ goal: _foreman.GOAL_TRANSPILE }),
            workers: (0, _immutable.fromJS)((_fromJS = {}, _fromJS[_workers3.WORKER_TRANSPILER] = { status: _workers3.STATUS_READY }, _fromJS))
          };
        } };
      var workers = (_workers2 = {}, _workers2[_workers3.WORKER_TRANSPILER] = { send: sendSpy }, _workers2);

      foreman.handleStateChange(store, workers);

      (0, _chai.expect)(sendSpy).to.be.calledWith((0, _transpiler.start)());
    });
  });
});
//# sourceMappingURL=foreman.test.js.map