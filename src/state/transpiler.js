import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const FINISH = 'ship-yard/transpiler/FINISH'
export const START = 'ship-yard/transpiler/START'
export const STARTED = 'ship-yard/traspiler/STARTED'
export const STATUS_IDLE = 'ship-yard/transpiler/STATUS_IDLE'
export const STATUS_STARTING = 'ship-yard/transpiler/STATUS_STARTING'
export const STATUS_IN_PROGRESS = 'ship-yard/transpiler/STATUS_IN_PROGRESS'

const initialState = fromJS({
  status: false,
})

export default handleActions({
  [FINISH]: state => {
    return state.set('status', STATUS_IDLE)
  },
  [START]: state => {
    return state.set('status', STATUS_STARTING)
  },
  [STARTED]: state => {
    return state.set('status', STATUS_IN_PROGRESS)
  },
}, initialState)

export const finish = createAction(FINISH)
export const start = createAction(START)
export const started = createAction(STARTED)
