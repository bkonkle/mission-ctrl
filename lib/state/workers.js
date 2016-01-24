'use strict';

var _fromJS, _handleActions;

exports.__esModule = true;
exports.stop = exports.ready = exports.offline = exports.error = exports.busy = exports.initialState = exports.WORKER_TRANSPILER = exports.WORKER_TEST_RUNNER = exports.WORKER_LINTER = exports.WORKER_DEV_SERVER = exports.WORKER_BUNDLER = exports.STATUS_STOPPING = exports.STATUS_READY = exports.STATUS_OFFLINE = exports.STATUS_ERROR = exports.STATUS_BUSY = exports.STOP = exports.READY = exports.OFFLINE = exports.ERROR = exports.BUSY = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var BUSY = exports.BUSY = 'ship-yard/workers/BUSY';
var ERROR = exports.ERROR = 'ship-yard/workers/ERROR';
var OFFLINE = exports.OFFLINE = 'ship-yard/workers/OFFLINE';
var READY = exports.READY = 'ship-yard/workers/READY';
var STOP = exports.STOP = 'ship-yard/workers/STOP';
var STATUS_BUSY = exports.STATUS_BUSY = 'ship-yard/workers/STATUS_BUSY';
var STATUS_ERROR = exports.STATUS_ERROR = 'ship-yard/workers/STATUS_ERROR';
var STATUS_OFFLINE = exports.STATUS_OFFLINE = 'ship-yard/workers/STATUS_OFFLINE';
var STATUS_READY = exports.STATUS_READY = 'ship-yard/workers/STATUS_READY';
var STATUS_STOPPING = exports.STATUS_STOPPING = 'ship-yard/workers/STOPPING';
var WORKER_BUNDLER = exports.WORKER_BUNDLER = 'ship-yard/workers/WORKER_BUNDLER';
var WORKER_DEV_SERVER = exports.WORKER_DEV_SERVER = 'ship-yard/workers/WORKER_DEV_SERVER';
var WORKER_LINTER = exports.WORKER_LINTER = 'ship-yard/workers/WORKER_LINTER';
var WORKER_TEST_RUNNER = exports.WORKER_TEST_RUNNER = 'ship-yard/workers/WORKER_TEST_RUNNER';
var WORKER_TRANSPILER = exports.WORKER_TRANSPILER = 'ship-yard/workers/WORKER_TRANSPILER';

var initialState = exports.initialState = (0, _immutable.fromJS)((_fromJS = {}, _fromJS[WORKER_TRANSPILER] = {
  error: null,
  status: STATUS_OFFLINE
}, _fromJS));

function updateStatus(status, state, action) {
  return state.update(action.payload.worker, function (workerState) {
    return workerState.merge({ error: action.payload.error || null, status: status });
  });
}

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[BUSY] = updateStatus.bind(null, STATUS_BUSY), _handleActions[ERROR] = updateStatus.bind(null, STATUS_ERROR), _handleActions[OFFLINE] = updateStatus.bind(null, STATUS_OFFLINE), _handleActions[READY] = updateStatus.bind(null, STATUS_READY), _handleActions[STOP] = updateStatus.bind(null, STATUS_STOPPING), _handleActions), initialState);
var busy = exports.busy = (0, _reduxActions.createAction)(BUSY, function (worker) {
  return { worker: worker };
});
var error = exports.error = (0, _reduxActions.createAction)(ERROR, function (worker) {
  return { worker: worker };
});
var offline = exports.offline = (0, _reduxActions.createAction)(OFFLINE, function (worker) {
  return { worker: worker };
});
var ready = exports.ready = (0, _reduxActions.createAction)(READY, function (worker) {
  return { worker: worker };
});
var stop = exports.stop = (0, _reduxActions.createAction)(STOP, function (worker) {
  return { worker: worker };
});
//# sourceMappingURL=workers.js.map