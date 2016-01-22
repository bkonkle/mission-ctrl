import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const READY = 'ship-yard/workers/READY'

export const initialState = fromJS({
  compiler: {
    ready: false,
  },
})

export default handleActions({
  [READY]: (state, action) => {
    return state.setIn([action.payload.processName, 'ready'], true)
  },
}, initialState)

export const ready = createAction(READY, processName => ({processName}))
