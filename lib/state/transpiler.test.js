'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _transpiler = require('./transpiler');

var transpiler = _interopRequireWildcard(_transpiler);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var reducer = transpiler.default;

describe('state/transpiler', function () {

  describe('reducer', function () {

    it('handles FINISH events by setting status to STATUS_IDLE', function () {
      var action = transpiler.finish();
      var initialState = (0, _immutable.fromJS)({ status: transpiler.STATUS_IN_PROGRESS });
      var expected = (0, _immutable.fromJS)({ status: transpiler.STATUS_IDLE });

      var result = reducer(initialState, action);

      (0, _chai.expect)(result).to.equal(expected);
    });

    it('handles START events by setting status to STATUS_STARTING', function () {
      var action = transpiler.start();
      var initialState = (0, _immutable.fromJS)({ status: transpiler.STATUS_IDLE });
      var expected = (0, _immutable.fromJS)({ status: transpiler.STATUS_STARTING });

      var result = reducer(initialState, action);

      (0, _chai.expect)(result).to.equal(expected);
    });

    it('handles STARTED events by setting status to STATUS_IN_PROGRESS', function () {
      var action = transpiler.started();
      var initialState = (0, _immutable.fromJS)({ status: transpiler.STATUS_STARTING });
      var expected = (0, _immutable.fromJS)({ status: transpiler.STATUS_IN_PROGRESS });

      var result = reducer(initialState, action);

      (0, _chai.expect)(result).to.equal(expected);
    });
  });
});
//# sourceMappingURL=transpiler.test.js.map