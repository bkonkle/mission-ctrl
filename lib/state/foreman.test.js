'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _foreman = require('./foreman');

var foreman = _interopRequireWildcard(_foreman);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var reducer = foreman.default;

describe('state/foreman', function () {

  describe('reducer', function () {

    it('handles SET_GOAL actions', function () {
      var action = foreman.setGoal(foreman.GOAL_TRANSPILE);
      var initialState = (0, _immutable.fromJS)({ goal: null });
      var expected = (0, _immutable.fromJS)({ goal: foreman.GOAL_TRANSPILE });

      var result = reducer(initialState, action);

      (0, _chai.expect)(result).to.equal(expected);
    });
  });
});
//# sourceMappingURL=foreman.test.js.map