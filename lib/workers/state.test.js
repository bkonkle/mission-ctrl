'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('workers/state', function () {

  describe('reducer()', function () {

    describe('READY', function () {

      it('sets the status to READY', function () {
        var action = (0, _state.workerReady)('transpiler');
        var initialState = (0, _immutable.fromJS)({ transpiler: { status: _state.OFFLINE } });
        var expected = (0, _immutable.fromJS)({ transpiler: { status: _state.READY, error: null } });

        var result = (0, _state2.default)(initialState, action);

        (0, _chai.expect)(result).to.equal(expected);
      });
    });
  });
});
//# sourceMappingURL=state.test.js.map