import {expect} from 'chai'
import {getStore} from 'state/store'

describe('state/store', () => {

  describe('getStore()', () => {

    it('returns a store object', () => {
      const result = getStore()
      expect(result).to.have.property('dispatch').and.be.a.function
      expect(result).to.have.property('subscribe').and.satisfy(func => func.name === 'subscribe')
      expect(result).to.have.property('getState').and.satisfy(func => func.name === 'getState')
      expect(result).to.have.property('replaceReducer').and.satisfy(func => func.name === 'replaceReducer')
    })

  })

})
