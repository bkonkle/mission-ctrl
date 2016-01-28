import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const IN_PROGRESS = 'ship-yard/watcher/IN_PROGRESS'
export const SET_GOAL = 'ship-yard/watcher/SET_GOAL'

const initialState = fromJS({
  goal: null,
  inProgress: null,
})

export default handleActions({
  [IN_PROGRESS]: (state, action) => state.set('inProgress', action.payload),
  [SET_GOAL]: (state, action) => state.set('goal', action.payload),
}, initialState)

export const inProgress = createAction(IN_PROGRESS)
export const setGoal = createAction(SET_GOAL)