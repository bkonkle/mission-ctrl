import {expect} from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/babel', () => {
  const dest = '/test/build/file.js'
  const filenames = ['/test/src/file.js', '/test/src/file.test.js']
  const options = {baseDir: '/test/src', filenames, outDir: '/test/build'}
  const codeEs6 = 'const CODE = "CODE"'
  const codeEs5 = 'var CODE = "CODE"'

  const chmodSpy = sinon.spy()
  const outputSpy = sinon.spy()
  const readFileStub = sinon.stub().returns(codeEs6)
  const statStub = sinon.stub().returns({mode: 'test'})
  const transformStub = sinon.stub().returns({code: codeEs5})

  const babelUtils = proxyquire('./babel', {
    'babel-core': {transformFileSync: transformStub},
    'fs': {chmodSync: chmodSpy, readFileSync: readFileStub, statSync: statStub},
    'utils/fs': {outputToMemFs: outputSpy},
  })

  afterEach(() => {
    chmodSpy.reset()
    outputSpy.reset()
    readFileStub.reset()
    statStub.reset().returns({mode: 'test'})
    transformStub.reset().returns({code: codeEs5})
  })

  describe('transpile()', () => {

    it('calls transformFileSync() with an appropriate source file and map target', () => {
      babelUtils.transpile(options)

      expect(transformStub).to.have.been.calledTwice

      const args = transformStub.firstCall.args
      expect(args[0]).to.equal('/test/src/file.js')
      expect(args[1]).to.have.property('sourceFileName', '../src/file.js')
      expect(args[1]).to.have.property('sourceMapTarget', 'file.js')
    })

    it('calls outputFileSync with the results', () => {
      babelUtils.transpile(options)

      expect(outputSpy).to.have.callCount(4)
      expect(outputSpy).to.have.been.calledWith(dest, `${codeEs5}\n//# sourceMappingURL=file.js.map`)
    })

  })

})
