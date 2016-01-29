import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const IN_PROGRESS = 'ship-yard/transpiler/IN_PROGRESS'
export const TRANSPILE = 'ship-yard/transpiler/TRANSPILE'

const initialState = fromJS({
  inProgress: null,
})

export default handleActions({
  [IN_PROGRESS]: (state, action) => state.set('inProgress', action.payload),
}, initialState)

export const inProgress = createAction(IN_PROGRESS)
