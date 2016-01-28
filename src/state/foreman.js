import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const GOAL_BUILD = 'ship-yard/foreman/GOAL_BUILD'
export const GOAL_BUNDLE = 'ship-yard/foreman/GOAL_BUNDLE'
export const GOAL_DEVELOP = 'ship-yard/foreman/GOAL_DEVELOP'
export const GOAL_LINT = 'ship-yard/foreman/GOAL_LINT'
export const GOAL_TEST = 'ship-yard/foreman/GOAL_TEST'
export const GOAL_TRANSPILE = 'ship-yard/foreman/GOAL_TRANSPILE'
export const GOAL_WATCH = 'ship-yard/foreman/GOAL_WATCH'
export const SET_GOAL = 'ship-yard/foreman/SET_GOAL'
export const SOURCE_CHANGED = 'ship-yard/foreman/SOURCE_CHANGED'

export const initialState = fromJS({
  goal: null,
})

export default handleActions({
  [SET_GOAL]: (state, action) => state.set('goal', action.payload.goal),
  [SOURCE_CHANGED]: state => state.set('goal', GOAL_TRANSPILE),
}, initialState)

export const setGoal = createAction(SET_GOAL, goal => ({goal}))
export const sourceChanged = createAction(SOURCE_CHANGED)
