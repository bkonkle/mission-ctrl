'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _foreman = require('state/foreman');

var _state = require('./state');

var transpiler = _interopRequireWildcard(_state);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var reducer = transpiler.default;

describe('workers/transpiler/state', function () {

  describe('reducer', function () {

    describe('IN_PROGRESS', function () {

      it('sets the inProgress flag', function () {
        var action = transpiler.inProgress(true);
        var initialState = (0, _immutable.fromJS)({ inProgress: false });
        var expected = (0, _immutable.fromJS)({ inProgress: true });

        var result = reducer(initialState, action);

        (0, _chai.expect)(result).to.equal(expected);
      });
    });

    describe('SET_GOAL', function () {

      it('sets the current goal of the transpiler', function () {
        var action = transpiler.setGoal(_foreman.GOAL_TRANSPILE);
        var initialState = (0, _immutable.fromJS)({ goal: null });
        var expected = (0, _immutable.fromJS)({ goal: _foreman.GOAL_TRANSPILE });

        var result = reducer(initialState, action);

        (0, _chai.expect)(result).to.equal(expected);
      });
    });
  });
});
//# sourceMappingURL=state.test.js.map