'use strict';

exports.__esModule = true;
exports.getReducer = getReducer;

var _redux = require('redux');

var _foreman = require('./foreman');

var _foreman2 = _interopRequireDefault(_foreman);

var _state = require('workers/linter/state');

var _state2 = _interopRequireDefault(_state);

var _state3 = require('workers/transpiler/state');

var _state4 = _interopRequireDefault(_state3);

var _state5 = require('workers/state');

var _state6 = _interopRequireDefault(_state5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getReducer() {
  return (0, _redux.combineReducers)({ foreman: _foreman2.default, linter: _state2.default, transpiler: _state4.default, workers: _state6.default });
}
//# sourceMappingURL=reducer.js.map