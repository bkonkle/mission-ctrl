'use strict';

exports.__esModule = true;
exports.default = compiler;

var _logging = require('../utils/logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logging2.default)('compiler');

function compiler() {
  this.postMessage({ message: 'Compiler, ready and waiting!' });
  this.onmessage = function (event) {
    return log.info('Foreman said:', event.data);
  };
}
module.exports = exports['default'];
//# sourceMappingURL=compiler.js.map