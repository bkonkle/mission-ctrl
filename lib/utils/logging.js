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
  function PlainStream(level) {
    _classCallCheck(this, PlainStream);

    this.level = level;
  }

  PlainStream.prototype.write = function write(rec) {
    var _this = this;

    var prefix = function prefix(message) {
      if (_this.level < _bunyan2.default.INFO) {
        return '[' + _chalk2.default.blue(rec.name) + '] ' + message;
      }
      return message;
    };

    if (rec.level < _bunyan2.default.INFO) {
      console.log(prefix(rec.msg));
    } else if (rec.level < _bunyan2.default.WARN) {
      console.info(prefix(rec.msg));
    } else if (rec.level < _bunyan2.default.ERROR) {
      if (typeof rec.msg === 'string') {
        rec.msg = _chalk2.default.yellow(rec.msg);
      }
      console.warn(prefix(rec.msg));
    } else {
      if (typeof rec.msg === 'string') {
        rec.msg = _chalk2.default.red(rec.msg);
      }
      console.error(prefix(rec.msg));
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

  var loglevel = _bunyan2.default.INFO;
  if (config.verbose) {
    loglevel = _bunyan2.default.DEBUG;
  } else if (config.quiet) {
    loglevel = _bunyan2.default.WARN;
  } else if (config.silent) {
    loglevel = _bunyan2.default.ERROR;
  }

  var settings = {
    name: name,
    streams: [{
      level: level || loglevel,
      type: 'raw',
      stream: new PlainStream(level || loglevel)
    }]
  };

  return _bunyan2.default.createLogger(settings);
}
//# sourceMappingURL=logging.js.map