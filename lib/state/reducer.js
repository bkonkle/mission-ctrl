'use strict';

exports.__esModule = true;
exports.getReducer = getReducer;

var _redux = require('redux');

var _workers = require('./workers');

var _workers2 = _interopRequireDefault(_workers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getReducer() {
  return (0, _redux.combineReducers)({ workers: _workers2.default });
}
//# sourceMappingURL=reducer.js.map