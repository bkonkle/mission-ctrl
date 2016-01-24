'use strict';

var _chai = require('chai');

var _store = require('./store');

describe('state/store', function () {

  describe('getStore()', function () {

    it('returns a store object', function () {
      var result = (0, _store.getStore)();
      (0, _chai.expect)(result).to.have.property('dispatch').and.be.a.function;
      (0, _chai.expect)(result).to.have.property('subscribe').and.satisfy(function (func) {
        return func.name === 'subscribe';
      });
      (0, _chai.expect)(result).to.have.property('getState').and.satisfy(function (func) {
        return func.name === 'getState';
      });
      (0, _chai.expect)(result).to.have.property('replaceReducer').and.satisfy(function (func) {
        return func.name === 'replaceReducer';
      });
    });
  });
});
//# sourceMappingURL=store.test.js.map