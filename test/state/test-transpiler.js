import {expect} from 'chai'
import {fromJS} from 'immutable'
import reducer, {finish, start} from 'state/transpiler'

describe('state/transpiler', () => {

  describe('reducer', () => {

    it('handles FINISH events by setting inProgress to false', () => {
      const action = finish()
      const initialState = fromJS({inProgress: true})
      const expected = fromJS({inProgress: false})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

    it('handles START events by setting inProgress to true', () => {
      const action = start()
      const initialState = fromJS({inProgress: false})
      const expected = fromJS({inProgress: true})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

  })

})
