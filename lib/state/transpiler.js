'use strict';

var _handleActions;

exports.__esModule = true;
exports.start = exports.finish = exports.START = exports.FINISH = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var FINISH = exports.FINISH = 'ship-yard/transpiler/FINISH';
var START = exports.START = 'ship-yard/transpiler/START';

var initialState = (0, _immutable.fromJS)({
  inProgress: false
});

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[FINISH] = function (state) {
  return state.set('inProgress', false);
}, _handleActions[START] = function (state) {
  return state.set('inProgress', true);
}, _handleActions), initialState);
var finish = exports.finish = (0, _reduxActions.createAction)(FINISH);
var start = exports.start = (0, _reduxActions.createAction)(START);
//# sourceMappingURL=transpiler.js.map