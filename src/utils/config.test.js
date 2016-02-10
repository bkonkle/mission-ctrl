import {expect} from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/config', () => {

  const findupStub = sinon.stub()

  const getConfig = proxyquire('./config', {
    'findup-sync': findupStub,
  })

  beforeEach(() => {
    findupStub.reset()
  })

  describe('getConfig()', () => {

    const expected = {
      _: [],
      dest: 'build',
      glob: '**/*.js?(x)',
      production: false,
      quiet: false,
      silent: false,
      source: 'src',
      trace: false,
      tmpDir: 'test',
      v: true,
      verbose: true,
    }

    it('checks the command line for options', () => {
      const args = ['--verbose', '--tmpDir', 'test']
      const result = getConfig(args)
      expect(result).to.deep.equal(expected)
    })

    it('checks an rc file for options', () => {
      findupStub.returns({verbose: true, tmpDir: 'test'})
      const result = getConfig([])
      expect(findupStub).to.have.been.calledWith('.shiprc')
      expect(result).to.deep.equal(expected)
    })

    it('sets verbose to true if trace is true', () => {
      const args = ['--trace', '--tmpDir', 'test']
      const result = getConfig(args)
      expect(result).to.deep.equal({...expected, trace: true})
    })

  })

})
