import {expect} from 'chai'
import {fromJS} from 'immutable'
import * as foreman from './foreman'

const reducer = foreman.default

describe('state/foreman', () => {

  describe('reducer', () => {

    describe('SET_GOAL', () => {

      it('sets the current goal to what was provided', () => {
        const action = foreman.setGoal(foreman.GOAL_WATCH)
        const initialState = fromJS({goal: null})
        const expected = fromJS({goal: foreman.GOAL_WATCH})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

    describe('SOURCE_CHANGED', () => {

      it('sets the current goal to GOAL_TRANSPILE', () => {
        const action = foreman.sourceChanged()
        const initialState = fromJS({goal: foreman.GOAL_WATCH})
        const expected = fromJS({goal: foreman.GOAL_TRANSPILE})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

  })

})
