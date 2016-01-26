'use strict';

exports.__esModule = true;
exports.memfs = undefined;
exports.outputToMemFs = outputToMemFs;

var _memoryFs = require('memory-fs');

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memfs = exports.memfs = new _memoryFs2.default();

function outputToMemFs(filePath, data) {
  var createdDirPath = memfs.mkdirpSync(_path2.default.dirname(filePath));
  memfs.writeFileSync(filePath, data);
  return createdDirPath;
}
//# sourceMappingURL=fs.js.map