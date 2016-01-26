'use strict';

exports.__esModule = true;
exports.init = init;
exports.transpile = transpile;
exports.stateChanged = stateChanged;

var _store = require('state/store');

var _foreman = require('state/foreman');

var _transpiler = require('state/transpiler');

var _workers = require('state/workers');

var _glob = require('glob');

var _babel = require('utils/babel');

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _config = require('utils/config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('workers/transpiler');

function init() {
  var store = (0, _store.getStore)();

  store.subscribe(stateChanged.bind(null, store));

  process.on('message', function (message) {
    log.debug('Message received:', message.type);
    store.dispatch(message);
  });

  process.send((0, _workers.workerReady)(_workers.WORKER_TRANSPILER));

  log.debug('Successfully initialized');
}

function transpile(store) {
  log.debug('Beginning transpile');

  var config = (0, _config2.default)();
  var filenames = (0, _glob.sync)(_path2.default.join(config.source, config.glob));

  process.send((0, _workers.workerBusy)(_workers.WORKER_TRANSPILER));
  store.dispatch((0, _transpiler.inProgress)(true));

  (0, _babel.transpileToDir)({
    baseDir: config.source,
    filenames: filenames,
    outDir: config.dest,
    sourceMaps: true
  });

  log.debug('Transpile complete');

  store.dispatch((0, _transpiler.inProgress)(false));
  process.send((0, _workers.workerReady)(_workers.WORKER_TRANSPILER));
}

function stateChanged(store) {
  log.debug('State changed');

  var state = store.getState();

  switch (state.transpiler.get('goal')) {
    case _foreman.GOAL_TRANSPILE:
      if (!state.transpiler.get('inProgress')) {
        transpile(store);
      }
      break;
    default:
    // Do nothing
  }
}

init();
//# sourceMappingURL=transpiler.js.map