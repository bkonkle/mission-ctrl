import {expect} from 'chai'
import {fromJS} from 'immutable'
import reducer, {start} from 'state/compiler'

describe('state/compiler', () => {

  describe('reducer', () => {

    it('handles START events by setting inProgress to true', () => {
      const action = start()
      const initialState = fromJS({inProgress: false})
      const expected = fromJS({inProgress: true})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

  })

})
