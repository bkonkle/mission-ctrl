'use strict';

exports.__esModule = true;
exports.mockStore = mockStore;

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiImmutable = require('chai-immutable');

var _chaiImmutable2 = _interopRequireDefault(_chaiImmutable);

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _sinonChai = require('sinon-chai');

var _sinonChai2 = _interopRequireDefault(_sinonChai);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

_chai2.default.use(_chaiImmutable2.default);
_chai2.default.use(_sinonChai2.default);

process.send = _sinon2.default.spy();
process.on = _sinon2.default.spy();

function mockStore() {
  return (0, _reduxMockStore2.default)([_reduxThunk2.default]).apply(undefined, arguments);
}
//# sourceMappingURL=test.js.map