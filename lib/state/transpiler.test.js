'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _transpiler = require('./transpiler');

var _transpiler2 = _interopRequireDefault(_transpiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('state/transpiler', function () {

  describe('reducer', function () {

    it('handles FINISH events by setting inProgress to false', function () {
      var action = (0, _transpiler.finish)();
      var initialState = (0, _immutable.fromJS)({ inProgress: true });
      var expected = (0, _immutable.fromJS)({ inProgress: false });

      var result = (0, _transpiler2.default)(initialState, action);

      (0, _chai.expect)(result).to.equal(expected);
    });

    it('handles START events by setting inProgress to true', function () {
      var action = (0, _transpiler.start)();
      var initialState = (0, _immutable.fromJS)({ inProgress: false });
      var expected = (0, _immutable.fromJS)({ inProgress: true });

      var result = (0, _transpiler2.default)(initialState, action);

      (0, _chai.expect)(result).to.equal(expected);
    });
  });
});
//# sourceMappingURL=transpiler.test.js.map