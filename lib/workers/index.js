'use strict';

exports.__esModule = true;
exports.init = init;
exports.lint = lint;
exports.stateChanged = stateChanged;

var _eslint = require('eslint');

var _foreman = require('state/foreman');

var _linter = require('state/linter');

var _workers = require('state/workers');

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _config = require('utils/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('workers/linter');

function init() {}

function lint(store) {
  log.debug('Beginning transpile');

  var config = (0, _config2.default)();

  process.send((0, _workers.workerBusy)(_workers.WORKER_LINTER));
  store.dispatch((0, _linter.inProgress)(true));

  var linter = new _eslint.CLIEngine();
  var report = linter.executeOnFiles([config.source]);
  console.log('report ------------------>', report);

  log.debug('Transpile complete');

  store.dispatch((0, _linter.inProgress)(false));
  process.send((0, _workers.workerReady)(_workers.WORKER_LINTER));
}

function stateChanged(store) {
  log.debug('State changed');

  var state = store.getState();

  switch (state.linter.get('goal')) {
    case _foreman.GOAL_LINT:
      if (!state.linter.get('inProgress')) {
        lint(store);
      }
      break;
    default:
    // Do nothing
  }
}
//# sourceMappingURL=index.js.map