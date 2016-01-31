import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const DONE = 'ship-yard/transpiler/DONE'
export const TRANSPILE = 'ship-yard/transpiler/TRANSPILE'

const initialState = fromJS({
  inProgress: null,
})

export default handleActions({
  [DONE]: state => state.set('inProgress', false),
  [TRANSPILE]: state => state.set('inProgress', true),
}, initialState)

export const done = createAction(DONE)
export const transpile = createAction(TRANSPILE)
