import {expect} from 'chai'
import {fromJS} from 'immutable'
import reducer, {ready} from 'state/workers'

describe('state/workers', () => {

  describe('reducer()', () => {

    it('handles READY events', () => {
      const action = ready('compiler')
      const initialState = fromJS({compiler: {ready: false}})
      const expected = fromJS({compiler: {ready: true}})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

  })

})
