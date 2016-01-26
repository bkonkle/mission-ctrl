import {getStore} from 'state/store'
import {setGoal as setLinterGoal} from 'workers/linter/state'
import {setGoal as setTranspilerGoal} from 'workers/transpiler/state'
import {setGoal, GOAL_TRANSPILE, GOAL_LINT} from 'state/foreman'
import {values} from 'ramda'
import * as workers from 'state/workers'
import childProcess from 'child_process'
import createLogger from 'utils/logging'
import path from 'path'

const log = createLogger('foreman')

export function init(storeOverride) {
  const store = storeOverride || getStore()

  const processes = {
    [workers.WORKER_TRANSPILER]: forkWorker('transpiler'),
  }

  values(processes).forEach(worker => {
    worker.on('message', message => {
      log.debug('Message received:', message.type)
      store.dispatch(message)
    })
  })

  store.subscribe(stateChanged.bind(null, store, processes))

  log.debug('Successfully initialized')

  store.dispatch(setGoal(GOAL_TRANSPILE))
}

export function forkWorker(worker) {
  const workerPath = path.resolve(
    path.join(__dirname, 'workers', `${worker}.js`)
  )
  return childProcess.fork(workerPath, [...process.argv.slice(2), '--color'], {
    env: {NODE_PATH: `${process.env.NODE_PATH}:${__dirname}`},
  })
}

export function stateChanged(store, processes) {
  log.debug('State changed')

  const state = store.getState()

  switch (state.foreman.get('goal')) {
    case GOAL_TRANSPILE:
      switch (state.workers.getIn([workers.WORKER_TRANSPILER, 'status'])) {
        case workers.READY:
          log.debug('Starting transpilation')
          processes[workers.WORKER_TRANSPILER].send(
            setTranspilerGoal(GOAL_TRANSPILE)
          )
          break
        case workers.DONE:
          store.dispatch(setGoal(GOAL_LINT))
          break
        case workers.OFFLINE:
          // Do nothing, since the process is still initializing
          break
        default:
          throw new Error('Unexpected state reached.')
      }
      break
    case GOAL_LINT:
      switch (state.workers.getIn([workers.WORKER_LINTER, 'status'])) {
        case workers.READY:
          log.debug('Starting linter')
          processes[workers.WORKER_LINTER].send(setLinterGoal(GOAL_LINT))
          break
        case workers.DONE:
          // Next!
          break
        case workers.OFFLINE:
          // Do nothing, since the process is still initializing
          break
        default:
          throw new Error('Unexpected state reached.')
      }
      break
    default:
      throw new Error('Foreman has no goal')
  }
}
