import {expect} from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/config', () => {

  const findupStub = sinon.stub()

  const getConfig = proxyquire('../../src/utils/config', {
    'findup-sync': findupStub,
  })

  afterEach(() => {
    findupStub.reset()
  })

  describe('getConfig()', () => {

    const expected = {
      _: [],
      quiet: false,
      silent: false,
      v: true,
      verbose: true,
    }

    it('checks the command line for options', () => {
      const args = ['--verbose']
      const result = getConfig(args)
      expect(result).to.deep.equal(expected)
    })

    it('checks an rc file for options', () => {
      findupStub.returns({verbose: true})
      const result = getConfig([])
      expect(findupStub).to.have.been.calledWith('.shipyardrc')
      expect(result).to.deep.equal(expected)
    })

  })

})
