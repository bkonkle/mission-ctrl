import {expect} from 'chai'
import {tmp} from 'utils/fs'
import path from 'path'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/babel', () => {
  const src = '/code/my-project/src/file.js'
  const dest = tmp('/code/my-project/build/file.js')
  const filenames = [src, '/code/my-project/src/test/file.test.js']
  const options = {baseDir: '/code/my-project/src', filenames, outDir: '/code/my-project/build'}
  const codeEs6 = 'const CODE = "CODE"'
  const codeEs5 = 'var CODE = "CODE"'

  const chmodSpy = sinon.spy()
  const outputSpy = sinon.spy()
  const readFileStub = sinon.stub()
  const statStub = sinon.stub()
  const transformStub = sinon.stub()

  const babel = proxyquire('./babel', {
    'babel-core': {transformFileSync: transformStub},
    'fs': {chmodSync: chmodSpy, readFileSync: readFileStub, statSync: statStub},
    'utils/fs': {outputTo: outputSpy},
  })

  beforeEach(() => {
    chmodSpy.reset()
    outputSpy.reset()
    readFileStub.reset().returns(codeEs6)
    statStub.reset().returns({mode: 'test'})
    transformStub.reset().returns({code: codeEs5})
  })

  describe('transpile()', () => {

    it('calls transformFileSync() with an appropriate source file and map target', () => {
      babel.transpile(options)

      expect(transformStub).to.have.been.calledTwice

      const args = transformStub.firstCall.args
      expect(args[0]).to.equal(src)
      expect(args[1]).to.have.property('sourceFileName', path.relative(path.dirname(dest), src))
      expect(args[1]).to.have.property('sourceMapTarget', 'file.js')
    })

    it('calls outputFileSync with the results', () => {
      babel.transpile(options)

      expect(outputSpy).to.have.callCount(4)
      expect(outputSpy).to.have.been.calledWith(dest, `${codeEs5}\n//# sourceMappingURL=file.js.map`)
    })

    it('prepends a forward slash to the destination if needed', () => {
      const source = path.resolve('src/test/file.test.js')
      const expected = tmp(source.replace('src/test', 'build/test'))

      babel.transpile({
        baseDir: 'src',
        filenames: [path.resolve('src/file.js'), path.resolve('src/test/file.test.js')],
        outDir: 'build',
      })

      expect(transformStub).to.have.been.calledTwice

      const args = transformStub.secondCall.args
      expect(args[0]).to.equal(source)
      expect(args[1]).to.have.property('sourceFileName', path.relative(path.dirname(expected), source))
      expect(args[1]).to.have.property('sourceMapTarget', 'file.test.js')
    })

    it('sets the mode of the compiled files to match the source files', () => {
      babel.transpile(options)

      expect(statStub).to.have.callCount(2)
      expect(statStub).to.have.been.calledWith(filenames[0])
      expect(statStub).to.have.been.calledWith(filenames[1])

      expect(chmodSpy).to.have.callCount(4)
      expect(chmodSpy).to.have.been.calledWith(dest, 'test')
      expect(chmodSpy).to.have.been.calledWith(dest + '.map', 'test')
    })

  })

})
