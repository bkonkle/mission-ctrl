import {expect} from 'chai'
import {fromJS} from 'immutable'
import * as foreman from './foreman'

const reducer = foreman.default

describe('state/foreman', () => {

  describe('reducer', () => {

    it('handles SET_GOAL actions', () => {
      const action = foreman.setGoal(foreman.GOAL_TRANSPILE)
      const initialState = fromJS({goal: null})
      const expected = fromJS({goal: foreman.GOAL_TRANSPILE})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

  })

})
