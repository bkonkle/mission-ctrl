import {expect} from 'chai'
import {fromJS} from 'immutable'
import {GOAL_WATCH} from 'state/foreman'
import * as watcher from './watcher'
const reducer = watcher.default

describe('state/watcher', () => {

  describe('reducer', () => {

    describe('IN_PROGRESS', () => {

      it('sets the inProgress flag', () => {
        const action = watcher.inProgress(true)
        const initialState = fromJS({inProgress: false})
        const expected = fromJS({inProgress: true})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

    describe('SET_GOAL', () => {

      it('sets the current goal of the transpiler', () => {
        const action = watcher.setGoal(GOAL_WATCH)
        const initialState = fromJS({goal: null})
        const expected = fromJS({goal: GOAL_WATCH})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

  })

})
