'use strict';

exports.__esModule = true;
exports.init = init;
exports.forkWorker = forkWorker;
exports.stateChanged = stateChanged;

var _store = require('state/store');

var _state = require('workers/linter/state');

var _state2 = require('workers/transpiler/state');

var _foreman = require('state/foreman');

var _ramda = require('ramda');

var _state3 = require('workers/state');

var workers = _interopRequireWildcard(_state3);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var log = (0, _logging2.default)('foreman');

function init(storeOverride) {
  var _processes;

  var store = storeOverride || (0, _store.getStore)();

  var processes = (_processes = {}, _processes[workers.WORKER_TRANSPILER] = forkWorker('transpiler'), _processes);

  (0, _ramda.values)(processes).forEach(function (worker) {
    worker.on('message', function (message) {
      log.debug('Message received:', message.type);
      store.dispatch(message);
    });
  });

  store.subscribe(stateChanged.bind(null, store, processes));

  log.debug('Successfully initialized');

  store.dispatch((0, _foreman.setGoal)(_foreman.GOAL_TRANSPILE));
}

function forkWorker(worker) {
  var workerPath = _path2.default.resolve(_path2.default.join(__dirname, 'workers', worker + '/index.js'));
  return _child_process2.default.fork(workerPath, [].concat(process.argv.slice(2), ['--color']), {
    env: { NODE_PATH: process.env.NODE_PATH + ':' + __dirname }
  });
}

function stateChanged(store, processes) {
  log.debug('State changed');

  var state = store.getState();

  switch (state.foreman.get('goal')) {
    case _foreman.GOAL_TRANSPILE:
      switch (state.workers.getIn([workers.WORKER_TRANSPILER, 'status'])) {
        case workers.READY:
          log.debug('Starting transpilation');
          processes[workers.WORKER_TRANSPILER].send((0, _state2.setGoal)(_foreman.GOAL_TRANSPILE));
          break;
        case workers.DONE:
          store.dispatch((0, _foreman.setGoal)(_foreman.GOAL_LINT));
          break;
        case workers.OFFLINE:
          // Do nothing, since the process is still initializing
          break;
        default:
          throw new Error('Unexpected state reached.');
      }
      break;
    case _foreman.GOAL_LINT:
      switch (state.workers.getIn([workers.WORKER_LINTER, 'status'])) {
        case workers.READY:
          log.debug('Starting linter');
          processes[workers.WORKER_LINTER].send((0, _state.setGoal)(_foreman.GOAL_LINT));
          break;
        case workers.DONE:
          // Next!
          break;
        case workers.OFFLINE:
          // Do nothing, since the process is still initializing
          break;
        default:
          throw new Error('Unexpected state reached.');
      }
      break;
    default:
      throw new Error('Foreman has no goal');
  }
}
//# sourceMappingURL=foreman.js.map