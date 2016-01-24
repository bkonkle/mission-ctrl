'use strict';

var _handleActions;

exports.__esModule = true;
exports.started = exports.start = exports.finish = exports.STATUS_IN_PROGRESS = exports.STATUS_STARTING = exports.STATUS_IDLE = exports.STARTED = exports.START = exports.FINISH = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var FINISH = exports.FINISH = 'ship-yard/transpiler/FINISH';
var START = exports.START = 'ship-yard/transpiler/START';
var STARTED = exports.STARTED = 'ship-yard/traspiler/STARTED';
var STATUS_IDLE = exports.STATUS_IDLE = 'ship-yard/transpiler/STATUS_IDLE';
var STATUS_STARTING = exports.STATUS_STARTING = 'ship-yard/transpiler/STATUS_STARTING';
var STATUS_IN_PROGRESS = exports.STATUS_IN_PROGRESS = 'ship-yard/transpiler/STATUS_IN_PROGRESS';

var initialState = (0, _immutable.fromJS)({
  status: false
});

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[FINISH] = function (state) {
  return state.set('status', STATUS_IDLE);
}, _handleActions[START] = function (state) {
  return state.set('status', STATUS_STARTING);
}, _handleActions[STARTED] = function (state) {
  return state.set('status', STATUS_IN_PROGRESS);
}, _handleActions), initialState);
var finish = exports.finish = (0, _reduxActions.createAction)(FINISH);
var start = exports.start = (0, _reduxActions.createAction)(START);
var started = exports.started = (0, _reduxActions.createAction)(STARTED);
//# sourceMappingURL=transpiler.js.map