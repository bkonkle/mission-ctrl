'use strict';

exports.__esModule = true;
exports.handleStateChange = handleStateChange;
exports.transpile = transpile;

var _transpiler = require('state/transpiler');

var _store = require('state/store');

var _workers = require('state/workers');

var _glob = require('glob');

var _babel = require('utils/babel');

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _config = require('utils/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('workers/transpiler');

function init() {
  log.debug('Transpiler initializing');

  var store = (0, _store.getStore)();

  store.subscribe(function () {
    return handleStateChange.bind(null, store);
  });

  process.on('message', function (message) {
    log.debug('Message received!', message);
    store.dispatch(message);
  });

  process.send((0, _workers.ready)(_workers.WORKER_TRANSPILER));

  log.debug('Transpiler successfully initialized');
}

function handleStateChange(store) {
  var state = store.getState();
  log.debug('State changed', state);
}

function transpile(store) {
  var config = (0, _config2.default)();
  var filenames = (0, _glob.sync)(config.source);

  process.send((0, _workers.busy)(_workers.WORKER_TRANSPILER));
  store.dispatch((0, _transpiler.start)());

  (0, _babel.transpileToDir)({
    outDir: config.outDir,
    sourceMaps: true
  }, filenames);

  store.dispatch((0, _transpiler.finish)());
  process.send((0, _workers.ready)(_workers.WORKER_TRANSPILER));
}

init();
//# sourceMappingURL=transpiler.js.map