import {getStore} from 'state/store'
import {setGoal, GOAL_TRANSPILE} from 'state/foreman'
import {start as startTranspiler} from 'state/transpiler'
import {STATUS_READY, WORKER_TRANSPILER} from 'state/workers'
import {values} from 'ramda'
import childProcess from 'child_process'
import createLogger from 'utils/logging'
import path from 'path'

const log = createLogger('foreman')

export function init(storeOverride) {
  const store = storeOverride || getStore()

  const workers = {
    [WORKER_TRANSPILER]: forkWorker('transpiler'),
  }

  values(workers).forEach(worker => {
    worker.on('message', message => {
      log.debug('Message received:', message.type)
      store.dispatch(message)
    })
  })

  store.subscribe(stateChanged.bind(null, store, workers))

  log.debug('Successfully initialized')

  store.dispatch(setGoal(GOAL_TRANSPILE))
}

export function forkWorker(worker) {
  const workerPath = path.resolve(
    path.join(__dirname, 'workers', `${worker}.js`)
  )
  return childProcess.fork(workerPath, process.argv.slice(2), {
    env: {
      NODE_PATH: `${process.env.NODE_PATH}:${__dirname}`,
      FORCE_COLOR: true,
    },
  })
}

export function stateChanged(store, workers) {
  log.debug('State changed')

  const state = store.getState()

  switch (state.foreman.get('goal')) {
    case GOAL_TRANSPILE:
      if (state.workers.getIn([WORKER_TRANSPILER, 'status']) === STATUS_READY) {
        log.debug('Starting transpilation')
        workers[WORKER_TRANSPILER].send(startTranspiler())
      }
      break
    default:
      throw new Error('Foreman has no goal')
  }
}
