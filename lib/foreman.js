'use strict';

exports.__esModule = true;
exports.init = init;
exports.forkWorker = forkWorker;
exports.handleStateChange = handleStateChange;

var _store = require('state/store');

var _foreman = require('state/foreman');

var _transpiler = require('state/transpiler');

var _workers2 = require('state/workers');

var _ramda = require('ramda');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('foreman');

function init(storeOverride) {
  var _workers;

  var store = storeOverride || (0, _store.getStore)();

  var workers = (_workers = {}, _workers[_workers2.WORKER_TRANSPILER] = forkWorker('transpiler'), _workers);

  (0, _ramda.values)(workers).forEach(function (worker) {
    worker.on('message', function (action) {
      return store.dispatch(action);
    });
  });

  store.subscribe(handleStateChange.bind(null, store, workers));

  log.debug('Successfully initialized');

  store.dispatch((0, _foreman.setGoal)(_foreman.GOAL_TRANSPILE));
}

function forkWorker(worker) {
  var workerPath = _path2.default.resolve(_path2.default.join(__dirname, 'workers', worker + '.js'));
  return _child_process2.default.fork(workerPath, process.argv.slice(2), {
    env: {
      NODE_PATH: process.env.NODE_PATH + ':' + __dirname,
      FORCE_COLOR: true
    }
  });
}

function handleStateChange(store, workers) {
  log.debug('State changed');

  var state = store.getState();

  switch (state.foreman.get('goal')) {
    case _foreman.GOAL_TRANSPILE:
      if (state.workers.getIn([_workers2.WORKER_TRANSPILER, 'status']) === _workers2.STATUS_READY) {
        log.debug('Starting transpilation');
        workers[_workers2.WORKER_TRANSPILER].send((0, _transpiler.start)());
      }
      break;
    default:
      throw new Error('Foreman has no goal');
  }
}
//# sourceMappingURL=foreman.js.map