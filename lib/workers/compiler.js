'use strict';

exports.__esModule = true;
exports.compile = compile;
exports.default = compiler;

var _config = require('utils/config');

var _workers = require('state/workers');

var _babel = require('babel');

var _babel2 = _interopRequireDefault(_babel);

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _glob = require('glob');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('compiler');

function compile() {
  var config = (0, _config.getConfig)();
  var files = (0, _glob.sync)(config.source);

  if (files) {
    files.forEach(function (filename) {
      var content = _babel2.default.transformFileSync(filename);
      log.debug('Compiled output:', content);
    });
  }
}

function compiler() {
  this.postMessage((0, _workers.ready)('compiler'));

  // TODO: Send messages received from the foreman through a redux reducer

  log.debug('Compiler process ready.');
}
//# sourceMappingURL=compiler.js.map