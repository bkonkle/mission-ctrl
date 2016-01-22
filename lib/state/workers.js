'use strict';

var _handleActions;

exports.__esModule = true;
exports.ready = exports.initialState = exports.READY = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var READY = exports.READY = 'ship-yard/workers/READY';

var initialState = exports.initialState = (0, _immutable.fromJS)({
  compiler: {
    ready: false
  }
});

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[READY] = function (state, action) {
  return state.setIn([action.payload.processName, 'ready'], true);
}, _handleActions), initialState);
var ready = exports.ready = (0, _reduxActions.createAction)(READY, function (processName) {
  return { processName: processName };
});
//# sourceMappingURL=workers.js.map