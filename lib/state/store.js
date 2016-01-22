'use strict';

exports.__esModule = true;
exports.getStore = getStore;

var _redux = require('redux');

var _reducer = require('./reducer');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStore(initialState) {
  var middleware = [_reduxThunk2.default];
  return _redux.applyMiddleware.apply(undefined, middleware)(_redux.createStore)((0, _reducer.getReducer)(), initialState);
}
//# sourceMappingURL=store.js.map