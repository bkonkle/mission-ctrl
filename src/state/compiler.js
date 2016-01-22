import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const START = 'ship-yard/compiler/START'

const initialState = fromJS({
  inProgress: false,
})

export default handleActions({
  [START]: state => {
    return state.set('inProgress', true)
  },
}, initialState)

export const start = createAction(START)
