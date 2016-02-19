import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const DONE = 'mission-ctrl/linter/DONE'
export const LINT = 'mission-ctrl/linter/LINT'

const initialState = fromJS({
  inProgress: null,
})

export default handleActions({
  [DONE]: state => state.set('inProgress', false),
  [LINT]: state => state.set('inProgress', true),
}, initialState)

export const done = createAction(DONE)
export const lint = createAction(LINT)
