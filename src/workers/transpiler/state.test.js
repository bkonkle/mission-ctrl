import {expect} from 'chai'
import {fromJS} from 'immutable'
import {GOAL_TRANSPILE} from 'state/foreman'
import * as transpiler from './state'
const reducer = transpiler.default

describe('workers/transpiler/state', () => {

  describe('reducer', () => {

    describe('IN_PROGRESS', () => {

      it('sets the inProgress flag', () => {
        const action = transpiler.inProgress(true)
        const initialState = fromJS({inProgress: false})
        const expected = fromJS({inProgress: true})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

    describe('SET_GOAL', () => {

      it('sets the current goal of the transpiler', () => {
        const action = transpiler.setGoal(GOAL_TRANSPILE)
        const initialState = fromJS({goal: null})
        const expected = fromJS({goal: GOAL_TRANSPILE})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

  })

})
