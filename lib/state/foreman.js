'use strict';

var _handleActions;

exports.__esModule = true;
exports.setGoal = exports.initialState = exports.SET_GOAL = exports.GOAL_TRANSPILE = exports.GOAL_TEST = exports.GOAL_DEVELOP = exports.GOAL_BUNDLE = exports.GOAL_BUILD = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var GOAL_BUILD = exports.GOAL_BUILD = 'ship-yard/foreman/GOAL_BUILD';
var GOAL_BUNDLE = exports.GOAL_BUNDLE = 'ship-yard/foreman/GOAL_BUNDLE';
var GOAL_DEVELOP = exports.GOAL_DEVELOP = 'ship-yard/foreman/GOAL_DEVELOP';
var GOAL_TEST = exports.GOAL_TEST = 'ship-yard/foreman/GOAL_TEST';
var GOAL_TRANSPILE = exports.GOAL_TRANSPILE = 'ship-yard/foreman/GOAL_TRANSPILE';
var SET_GOAL = exports.SET_GOAL = 'ship-yard/foreman/SET_GOAL';

var initialState = exports.initialState = (0, _immutable.fromJS)({
  goal: null
});

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[SET_GOAL] = function (state, action) {
  return state.set('goal', action.payload.goal);
}, _handleActions), initialState);
var setGoal = exports.setGoal = (0, _reduxActions.createAction)(SET_GOAL, function (goal) {
  return { goal: goal };
});
//# sourceMappingURL=foreman.js.map