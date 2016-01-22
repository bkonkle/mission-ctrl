'use strict';

exports.__esModule = true;
exports.init = init;

var _store = require('state/store');

var _ramda = require('ramda');

var _compiler = require('workers/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _webworkerThreads = require('webworker-threads');

var _webworkerThreads2 = _interopRequireDefault(_webworkerThreads);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('foreman');

function init(store) {
  var _ref = store || (0, _store.getStore)();

  var dispatch = _ref.dispatch;

  var workers = {
    compiler: new _webworkerThreads2.default.Worker(_compiler2.default)
  };

  var dispatchAction = function dispatchAction(action) {
    return dispatch(action);
  };
  (0, _ramda.values)(workers).forEach(function (worker) {
    worker.onmessage = dispatchAction;
  });

  log.debug('Foreman successfully initialized.');
}

if (require.main === module) {
  init();
}
//# sourceMappingURL=foreman.js.map