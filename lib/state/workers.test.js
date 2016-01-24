'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _workers = require('./workers');

var _workers2 = _interopRequireDefault(_workers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('state/workers', function () {

  describe('reducer()', function () {

    it('handles READY events', function () {
      var action = (0, _workers.ready)('transpiler');
      var initialState = (0, _immutable.fromJS)({ transpiler: { status: _workers.STATUS_OFFLINE } });
      var expected = (0, _immutable.fromJS)({ transpiler: { status: _workers.STATUS_READY, error: null } });

      var result = (0, _workers2.default)(initialState, action);

      (0, _chai.expect)(result).to.equal(expected);
    });
  });
});
//# sourceMappingURL=workers.test.js.map