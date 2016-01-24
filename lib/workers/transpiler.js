'use strict';

exports.__esModule = true;
exports.init = init;
exports.transpile = transpile;
exports.stateChanged = stateChanged;

var _store = require('state/store');

var _workers = require('state/workers');

var _glob = require('glob');

var _babel = require('utils/babel');

var _transpiler = require('state/transpiler');

var transpiler = _interopRequireWildcard(_transpiler);

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _config = require('utils/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var log = (0, _logging2.default)('workers/transpiler');

function init() {
  var store = (0, _store.getStore)();

  store.subscribe(function () {
    return stateChanged.bind(null, store);
  });

  process.on('message', function (message) {
    log.debug('Message received:', message.type);
    store.dispatch(message);
  });

  process.send((0, _workers.ready)(_workers.WORKER_TRANSPILER));

  log.debug('Successfully initialized');
}

function transpile(store) {
  var config = (0, _config2.default)();
  var filenames = (0, _glob.sync)(config.source);

  process.send((0, _workers.busy)(_workers.WORKER_TRANSPILER));
  store.dispatch(transpiler.started());

  (0, _babel.transpileToDir)({
    outDir: config.outDir,
    sourceMaps: true
  }, filenames);

  store.dispatch(transpiler.finish());
  process.send((0, _workers.ready)(_workers.WORKER_TRANSPILER));
}

function stateChanged(store) {
  var state = store.getState();

  switch (state.transpiler.get('status')) {
    case transpiler.STATUS_STARTING:
      transpile(store);
      break;
    case transpiler.STATUS_IN_PROGRESS:
      throw new Error('Not sure if this can ever happen... now you know!');
    default:
    // Do nothing
  }
}

init();
//# sourceMappingURL=transpiler.js.map