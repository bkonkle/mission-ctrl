'use strict';

exports.__esModule = true;
exports.PlainStream = undefined;
exports.default = createLogger;

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* eslint no-console:0 */

var PlainStream = exports.PlainStream = function () {
  function PlainStream() {
    _classCallCheck(this, PlainStream);
  }

  PlainStream.prototype.write = function write(rec) {
    var record = rec.msg;

    if (rec.level < _bunyan2.default.INFO) {
      console.log(record);
    } else if (rec.level < _bunyan2.default.WARN) {
      console.info(record);
    } else if (rec.level < _bunyan2.default.ERROR) {
      console.warn(record);
    } else {
      if (typeof record === 'string') {
        record = _chalk2.default.red(record);
      }
      console.error(record);
    }
  };

  return PlainStream;
}();

/**
 * Create a logger with the given name.
 *
 * @param {String} name - the name for the logger (usually the module being
 *                        logged in)
 * @param {Number} [level] - an optional override for the loglevel
 * @return {Object} - the bunyan logger object
 */

function createLogger(name, level) {
  var config = (0, _config2.default)();

  var loglevel = 'info';
  if (config.verbose) {
    loglevel = 'debug';
  } else if (config.quiet) {
    loglevel = 'warning';
  } else if (config.silent) {
    loglevel = 'error';
  }

  var settings = {
    name: name,
    streams: [{
      level: level || loglevel,
      type: 'raw',
      stream: new PlainStream()
    }]
  };

  return _bunyan2.default.createLogger(settings);
}
//# sourceMappingURL=logging.js.map