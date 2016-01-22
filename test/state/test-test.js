import {expect} from 'chai'
import {mockStore} from 'utils/test'

describe('utils/test', () => {

  describe('mockStore()', () => {

    it('returns a redux-mock-store', () => {
      const expectedActions = [{type: 'TEST'}]
      const result = mockStore({}, expectedActions)
      expect(result).to.have.property('dispatch')
      expect(result).to.have.property('getState')
    })

  })

})
