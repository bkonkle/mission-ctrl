'use strict';

var _chai = require('chai');

var _fs = require('./fs');

describe('utils/fs', function () {

  describe('outputToMemFs()', function () {

    it('saves the requested file to the virtual filesystem', function () {
      var code = 'export const test = \'test\'';
      (0, _fs.outputToMemFs)('/test.js', code);

      var stat = _fs.memfs.statSync('/test.js');
      (0, _chai.expect)(stat.isDirectory()).to.be.false;
      (0, _chai.expect)(stat.isFile()).to.be.true;

      (0, _chai.expect)(_fs.memfs.readFileSync('/test.js').toString()).to.equal(code);
    });

    it('creates intermediate directories as needed', function () {
      var code = 'export const test = \'test\'';
      (0, _fs.outputToMemFs)('/reach/for/the/sky.js', code);

      var stat = _fs.memfs.statSync('/reach/for');
      (0, _chai.expect)(stat.isDirectory()).to.be.true;
      (0, _chai.expect)(stat.isFile()).to.be.false;

      stat = _fs.memfs.statSync('/reach/for/the/sky.js');
      (0, _chai.expect)(stat.isDirectory()).to.be.false;
      (0, _chai.expect)(stat.isFile()).to.be.true;

      (0, _chai.expect)(_fs.memfs.readFileSync('/reach/for/the/sky.js').toString()).to.equal(code);
    });
  });
});
//# sourceMappingURL=fs.test.js.map