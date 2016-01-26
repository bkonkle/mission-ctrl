'use strict';

var _fromJS, _handleActions;

exports.__esModule = true;
exports.workerStop = exports.workerReady = exports.workerOffline = exports.workerError = exports.workerDone = exports.workerBusy = exports.initialState = exports.WORKER_TRANSPILER = exports.WORKER_TEST_RUNNER = exports.WORKER_LINTER = exports.WORKER_DEV_SERVER = exports.WORKER_BUNDLER = exports.STOP = exports.READY = exports.OFFLINE = exports.ERROR = exports.DONE = exports.BUSY = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var BUSY = exports.BUSY = 'ship-yard/workers/BUSY';
var DONE = exports.DONE = 'ship-yard/workers/DONE';
var ERROR = exports.ERROR = 'ship-yard/workers/ERROR';
var OFFLINE = exports.OFFLINE = 'ship-yard/workers/OFFLINE';
var READY = exports.READY = 'ship-yard/workers/READY';
var STOP = exports.STOP = 'ship-yard/workers/STOP';
var WORKER_BUNDLER = exports.WORKER_BUNDLER = 'ship-yard/workers/WORKER_BUNDLER';
var WORKER_DEV_SERVER = exports.WORKER_DEV_SERVER = 'ship-yard/workers/WORKER_DEV_SERVER';
var WORKER_LINTER = exports.WORKER_LINTER = 'ship-yard/workers/WORKER_LINTER';
var WORKER_TEST_RUNNER = exports.WORKER_TEST_RUNNER = 'ship-yard/workers/WORKER_TEST_RUNNER';
var WORKER_TRANSPILER = exports.WORKER_TRANSPILER = 'ship-yard/workers/WORKER_TRANSPILER';

var initialState = exports.initialState = (0, _immutable.fromJS)((_fromJS = {}, _fromJS[WORKER_TRANSPILER] = { error: null, status: OFFLINE }, _fromJS[WORKER_LINTER] = { error: null, status: OFFLINE }, _fromJS));

function updateStatus(status, state, action) {
  return state.update(action.payload.worker, function (workerState) {
    return workerState.merge({ error: action.payload.error || null, status: status });
  });
}

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[BUSY] = updateStatus.bind(null, BUSY), _handleActions[DONE] = updateStatus.bind(null, DONE), _handleActions[ERROR] = updateStatus.bind(null, ERROR), _handleActions[OFFLINE] = updateStatus.bind(null, OFFLINE), _handleActions[READY] = updateStatus.bind(null, READY), _handleActions[STOP] = updateStatus.bind(null, STOP), _handleActions), initialState);
var workerBusy = exports.workerBusy = (0, _reduxActions.createAction)(BUSY, function (worker) {
  return { worker: worker };
});
var workerDone = exports.workerDone = (0, _reduxActions.createAction)(DONE, function (worker) {
  return { worker: worker };
});
var workerError = exports.workerError = (0, _reduxActions.createAction)(ERROR, function (worker) {
  return { worker: worker };
});
var workerOffline = exports.workerOffline = (0, _reduxActions.createAction)(OFFLINE, function (worker) {
  return { worker: worker };
});
var workerReady = exports.workerReady = (0, _reduxActions.createAction)(READY, function (worker) {
  return { worker: worker };
});
var workerStop = exports.workerStop = (0, _reduxActions.createAction)(STOP, function (worker) {
  return { worker: worker };
});
//# sourceMappingURL=workers.js.map