'use strict';

exports.__esModule = true;
exports.getReducer = getReducer;

var _redux = require('redux');

var _foreman = require('./foreman');

var _foreman2 = _interopRequireDefault(_foreman);

var _transpiler = require('./transpiler');

var _transpiler2 = _interopRequireDefault(_transpiler);

var _workers = require('./workers');

var _workers2 = _interopRequireDefault(_workers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getReducer() {
  return (0, _redux.combineReducers)({ foreman: _foreman2.default, transpiler: _transpiler2.default, workers: _workers2.default });
}
//# sourceMappingURL=reducer.js.map