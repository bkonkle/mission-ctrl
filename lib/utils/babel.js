'use strict';

exports.__esModule = true;
exports.chmod = chmod;
exports.shouldIgnore = shouldIgnore;
exports.addSourceMappingUrl = addSourceMappingUrl;
exports.transform = transform;
exports.compile = compile;
exports.transpileToDir = transpileToDir;

var _babelCore = require('babel-core');

var _babelCore2 = _interopRequireDefault(_babelCore);

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _outputFileSync = require('output-file-sync');

var _outputFileSync2 = _interopRequireDefault(_outputFileSync);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

var _fsReaddirRecursive = require('fs-readdir-recursive');

var _fsReaddirRecursive2 = _interopRequireDefault(_fsReaddirRecursive);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('utils/babel');

function chmod(src, dest) {
  _fs2.default.chmodSync(dest, _fs2.default.statSync(src).mode);
}

function shouldIgnore(loc, ignore, only) {
  return _babelCore2.default.util.shouldIgnore(loc, ignore, only);
}

function addSourceMappingUrl(code, loc) {
  return code + '\n//# sourceMappingURL=' + _path2.default.basename(loc);
}

function transform(filename, code, options) {
  options.filename = filename;
  options.ignore = null;
  options.only = null;

  var result = _babelCore2.default.transform(code, options);
  result.filename = filename;
  result.actual = code;
  return result;
}

function compile(filename, options) {
  var code = _fs2.default.readFileSync(filename, 'utf8');
  return transform(filename, code, options);
}

/**
 * Compiles the given filenames to the outDir. Taken from babel-cli.
 * @param {Object} options
 * @param {Array} filenames
 */
function transpileToDir(options, filenames) {
  function write(src, rel) {
    // remove extension and then append back on .js
    var relative = rel.replace(/\.(\w*?)$/, '') + '.js';

    var dest = _path2.default.join(options.outDir, relative);

    var data = compile(src, {
      sourceFileName: (0, _slash2.default)(_path2.default.relative(dest + '/..', src)),
      sourceMapTarget: _path2.default.basename(relative)
    });
    if (!options.copyFiles && data.ignored) return;

    // we've requested explicit sourcemaps to be written to disk
    if (data.map && options.sourceMaps && options.sourceMaps !== 'inline') {
      var mapLoc = dest + '.map';
      data.code = addSourceMappingUrl(data.code, mapLoc);
      (0, _outputFileSync2.default)(mapLoc, JSON.stringify(data.map));
    }

    (0, _outputFileSync2.default)(dest, data.code);
    chmod(src, dest);

    log.debug(src + ' -> ' + dest);
  }

  function handleFile(src, filename) {
    if (shouldIgnore(src, options.ignore, options.only)) return;

    if (_babelCore2.default.util.canCompile(filename, options.extensions)) {
      write(src, filename);
    } else if (options.copyFiles) {
      var dest = _path2.default.join(options.outDir, filename);
      (0, _outputFileSync2.default)(dest, _fs2.default.readFileSync(src));
      chmod(src, dest);
    }
  }

  function handle(filename) {
    if (!_pathExists2.default.sync(filename)) return;

    var stat = _fs2.default.statSync(filename);

    if (stat.isDirectory(filename)) {
      (function () {
        var dirname = filename;

        (0, _fsReaddirRecursive2.default)(dirname).forEach(function (file) {
          var src = _path2.default.join(dirname, file);
          handleFile(src, filename);
        });
      })();
    } else {
      write(filename, filename);
    }
  }

  filenames.forEach(handle);
}
//# sourceMappingURL=babel.js.map