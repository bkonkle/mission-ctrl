import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const DONE = 'mission-ctrl/test-runner/DONE'
export const TEST = 'mission-ctrl/test-runner/TEST'

const initialState = fromJS({
  inProgress: null,
})

export default handleActions({
  [DONE]: state => state.set('inProgress', false),
  [TEST]: state => state.set('inProgress', true),
}, initialState)

export const done = createAction(DONE)
export const runTests = createAction(TEST)
