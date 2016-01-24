'use strict';

var _chai = require('chai');

var _test = require('./test');

describe('utils/test', function () {

  describe('mockStore()', function () {

    it('returns a redux-mock-store', function () {
      var expectedActions = [{ type: 'TEST' }];
      var result = (0, _test.mockStore)({}, expectedActions);
      (0, _chai.expect)(result).to.have.property('dispatch');
      (0, _chai.expect)(result).to.have.property('getState');
    });
  });
});
//# sourceMappingURL=test.test.js.map