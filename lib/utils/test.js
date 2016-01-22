'use strict';

exports.__esModule = true;
exports.mockStore = mockStore;

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mockStore() {
  return (0, _reduxMockStore2.default)([_reduxThunk2.default]).apply(undefined, arguments);
}
//# sourceMappingURL=test.js.map