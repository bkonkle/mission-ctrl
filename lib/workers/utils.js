'use strict';

exports.__esModule = true;
exports.workerInit = undefined;

var _store = require('state/store');

var _state = require('workers/state');

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('workers/utils');

var workerInit = exports.workerInit = function workerInit(worker, stateChanged) {
  return function () {
    var store = (0, _store.getStore)();

    store.subscribe(stateChanged.bind(null, store));

    process.on('message', function (message) {
      log.debug('Message received for ' + worker + ': ' + message.type);
      store.dispatch(message);
    });

    process.send((0, _state.workerReady)(worker));

    log.debug('Worker ' + worker + ' successfully initialized');
  };
};
//# sourceMappingURL=utils.js.map