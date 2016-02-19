import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const DONE = 'mission-ctrl/transpiler/DONE'
export const TRANSPILE = 'mission-ctrl/transpiler/TRANSPILE'

const initialState = fromJS({
  inProgress: null,
})

export default handleActions({
  [DONE]: state => state.set('inProgress', false),
  [TRANSPILE]: state => state.set('inProgress', true),
}, initialState)

export const done = createAction(DONE)
export const transpile = createAction(TRANSPILE)
