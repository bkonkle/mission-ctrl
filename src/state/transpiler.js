import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const FINISH = 'ship-yard/transpiler/FINISH'
export const START = 'ship-yard/transpiler/START'

const initialState = fromJS({
  inProgress: false,
})

export default handleActions({
  [FINISH]: state => {
    return state.set('inProgress', false)
  },
  [START]: state => {
    return state.set('inProgress', true)
  },
}, initialState)

export const finish = createAction(FINISH)
export const start = createAction(START)
