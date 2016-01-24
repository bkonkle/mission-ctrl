'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;
exports.default = getConfig;

var _findupSync = require('findup-sync');

var _findupSync2 = _interopRequireDefault(_findupSync);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULTS = {
  outDir: 'build',
  source: 'src/**/*.js?(x)',
  production: false
};

function getConfig(argv) {
  var config = (0, _findupSync2.default)('.shipyardrc');

  var args = argv || process.argv.slice(2);
  var options = (0, _minimist2.default)(args, {
    alias: { verbose: 'v' },
    boolean: ['verbose', 'quiet', 'silent'],
    default: _extends({}, DEFAULTS, config)
  });

  return _extends({}, options);
}
module.exports = exports['default'];
//# sourceMappingURL=config.js.map