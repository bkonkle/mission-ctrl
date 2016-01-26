'use strict';

var _handleActions;

exports.__esModule = true;
exports.setGoal = exports.inProgress = exports.SET_GOAL = exports.IN_PROGRESS = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var IN_PROGRESS = exports.IN_PROGRESS = 'ship-yard/linter/IN_PROGRESS';
var SET_GOAL = exports.SET_GOAL = 'ship-yard/linter/SET_GOAL';

var initialState = (0, _immutable.fromJS)({
  goal: null,
  inProgress: null
});

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[IN_PROGRESS] = function (state, action) {
  return state.set('inProgress', action.payload);
}, _handleActions[SET_GOAL] = function (state, action) {
  return state.set('goal', action.payload);
}, _handleActions), initialState);
var inProgress = exports.inProgress = (0, _reduxActions.createAction)(IN_PROGRESS);
var setGoal = exports.setGoal = (0, _reduxActions.createAction)(SET_GOAL);
//# sourceMappingURL=linter.js.map