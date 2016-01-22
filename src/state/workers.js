import {createAction, handleActions} from 'redux-actions'
import {fromJS} from 'immutable'

export const BUSY = 'ship-yard/workers/BUSY'
export const ERROR = 'ship-yard/workers/ERROR'
export const OFFLINE = 'ship-yard/workers/OFFLINE'
export const READY = 'ship-yard/workers/READY'
export const STOP = 'ship-yard/workers/STOP'
export const STATUS_BUSY = 'ship-yard/workers/STATUS_BUSY'
export const STATUS_ERROR = 'ship-yard/workers/STATUS_ERROR'
export const STATUS_OFFLINE = 'ship-yard/workers/STATUS_OFFLINE'
export const STATUS_READY = 'ship-yard/workers/STATUS_READY'
export const STATUS_STOPPING = 'ship-yard/workers/STOPPING'
export const WORKER_BUNDLER = 'ship-yard/workers/WORKER_BUNDLER'
export const WORKER_DEV_SERVER = 'ship-yard/workers/WORKER_DEV_SERVER'
export const WORKER_LINTER = 'ship-yard/workers/WORKER_LINTER'
export const WORKER_TEST_RUNNER = 'ship-yard/workers/WORKER_TEST_RUNNER'
export const WORKER_TRANSPILER = 'ship-yard/workers/WORKER_TRANSPILER'

export const initialState = fromJS({
  [WORKER_TRANSPILER]: {
    error: null,
    status: STATUS_OFFLINE,
  },
})

function updateStatus(status, state, action) {
  return state.update(action.payload.worker, workerState => {
    return workerState.merge({error: action.payload.error || null, status})
  })
}

export default handleActions({
  [BUSY]: updateStatus.bind(null, STATUS_BUSY),
  [ERROR]: updateStatus.bind(null, STATUS_ERROR),
  [OFFLINE]: updateStatus.bind(null, STATUS_OFFLINE),
  [READY]: updateStatus.bind(null, STATUS_READY),
  [STOP]: updateStatus.bind(null, STATUS_STOPPING),
}, initialState)

export const busy = createAction(BUSY, worker => ({worker}))
export const error = createAction(ERROR, worker => ({worker}))
export const offline = createAction(OFFLINE, worker => ({worker}))
export const ready = createAction(READY, worker => ({worker}))
export const stop = createAction(STOP, worker => ({worker}))
