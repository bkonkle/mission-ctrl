'use strict';

exports.__esModule = true;
exports.getReducer = getReducer;

var _redux = require('redux');

var _foreman = require('./foreman');

var _foreman2 = _interopRequireDefault(_foreman);

var _state = require('workers/transpiler/state');

var _state2 = _interopRequireDefault(_state);

var _state3 = require('workers/state');

var _state4 = _interopRequireDefault(_state3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getReducer() {
  return (0, _redux.combineReducers)({ foreman: _foreman2.default, transpiler: _state2.default, workers: _state4.default });
}
//# sourceMappingURL=reducer.js.map