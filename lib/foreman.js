'use strict';

exports.__esModule = true;
exports.init = init;

var _compiler = require('./workers/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _logging = require('./utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _webworkerThreads = require('webworker-threads');

var _webworkerThreads2 = _interopRequireDefault(_webworkerThreads);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('foreman');

function init() {
  var workers = {
    compiler: new _webworkerThreads2.default.Worker(_compiler2.default)
  };

  workers.compiler.onmessage = function (event) {
    log.info('Message received from the compiler:', event.data);
  };
}

if (require.main === module) {
  init();
}
//# sourceMappingURL=foreman.js.map