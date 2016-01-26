'use strict';

exports.__esModule = true;
exports.transpile = transpile;
exports.addSourceMappingUrl = addSourceMappingUrl;

var _fs = require('utils/fs');

var _babelCore = require('babel-core');

var _logging = require('utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _fs2 = require('fs');

var _fs3 = _interopRequireDefault(_fs2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('utils/babel');

/**
 * Compiles the given filenames to the destination
 *
 * @param {String} options.baseDir - the base directory for relative paths
 * @param {Boolean} [options.copyFiles] - whether to copy files to the
 *   destination that weren't transformed by Babel, defaults to false
 * @param {String} options.outDir - the destination directory
 * @param {Array} options.filenames - an array of filenames to transform
 */
function transpile(_ref) {
  var baseDir = _ref.baseDir;
  var _ref$copyFiles = _ref.copyFiles;
  var copyFiles = _ref$copyFiles === undefined ? false : _ref$copyFiles;
  var outDir = _ref.outDir;
  var filenames = _ref.filenames;

  filenames.forEach(function (filename) {
    // remove extension and then append back on .js
    var relative = _path2.default.relative(baseDir, filename.replace(/\.(\w*?)$/, '') + '.js');

    var dest = _path2.default.join(outDir, relative);

    var data = (0, _babelCore.transformFileSync)(filename, {
      sourceFileName: (0, _slash2.default)(_path2.default.relative(dest + '/..', filename)),
      sourceMapTarget: _path2.default.basename(relative)
    });
    if (!copyFiles && data.ignored) return;

    // Output source map
    var mapLoc = dest + '.map';
    data.code = addSourceMappingUrl(data.code, mapLoc);
    (0, _fs.outputToMemFs)(mapLoc, JSON.stringify(data.map));

    // Output transpiled file
    (0, _fs.outputToMemFs)(dest, data.code);
    _fs3.default.chmodSync(dest, _fs3.default.statSync(filename).mode);

    log.debug(filename + ' -> ' + dest);
  });
}

function addSourceMappingUrl(code, loc) {
  return code + '\n//# sourceMappingURL=' + _path2.default.basename(loc);
}
//# sourceMappingURL=babel.js.map