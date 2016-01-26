import {expect} from 'chai'
import {fromJS} from 'immutable'
import {GOAL_LINT} from 'state/foreman'
import * as linter from './state'
const reducer = linter.default

describe('workers/linter/state', () => {

  describe('reducer', () => {

    describe('IN_PROGRESS', () => {

      it('sets the inProgress flag', () => {
        const action = linter.inProgress(true)
        const initialState = fromJS({inProgress: false})
        const expected = fromJS({inProgress: true})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

    describe('SET_GOAL', () => {

      it('sets the current goal of the transpiler', () => {
        const action = linter.setGoal(GOAL_LINT)
        const initialState = fromJS({goal: null})
        const expected = fromJS({goal: GOAL_LINT})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

  })

})
