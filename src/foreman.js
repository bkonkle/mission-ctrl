import 'babel-polyfill'
import {getStore} from 'state/store'
// import {start} from 'workers'
// import {setGoal as setLinterGoal} from 'state/linter'
// import {setGoal as setTranspilerGoal} from 'state/transpiler'
// import {setGoal as setWatcherGoal} from 'state/watcher'
// import {values} from 'ramda'
import * as foreman from 'state/foreman'
// import * as workers from 'state/workers'
import createLogger from 'utils/logging'

const log = createLogger('foreman')

export function init(storeOverride) {
  const store = storeOverride || getStore()

  // const processes = start()
  //
  // values(processes).forEach(worker => {
  //   worker.on('message', message => {
  //     log.debug('Message received:', message.type)
  //     store.dispatch(message)
  //   })
  // })

  // store.subscribe(stateChanged.bind(null, store, processes))

  log.debug('Successfully initialized')

  store.dispatch(foreman.setGoal(foreman.GOAL_WATCH))

  // TODO: Find a better way to do this?
  process.stdin.resume()
}

// export function stateChanged(store, processes) {
//   const state = store.getState()
//
//   switch (state.foreman.get('goal')) {
//     case foreman.GOAL_WATCH:
//       switch (state.workers.getIn([workers.WORKER_WATCHER, 'status'])) {
//         case workers.READY:
//           store.dispatch(workers.workerBusy(workers.WORKER_WATCHER))
//           processes[workers.WORKER_WATCHER].send(
//             setWatcherGoal(foreman.GOAL_WATCH)
//           )
//           break
//         case workers.DONE:
//           store.dispatch(foreman.setGoal(foreman.GOAL_TRANSPILE))
//           store.dispatch(workers.workerReady(workers.WORKER_WATCHER))
//           break
//         case workers.OFFLINE:
//         case workers.BUSY:
//           // Wait
//           break
//         default:
//           throw new Error('Unexpected state reached.')
//       }
//       break
//     case foreman.GOAL_TRANSPILE:
//       switch (state.workers.getIn([workers.WORKER_TRANSPILER, 'status'])) {
//         case workers.READY:
//           log.debug('Starting transpilation')
//           store.dispatch(workers.workerBusy(workers.WORKER_TRANSPILER))
//           processes[workers.WORKER_TRANSPILER].send(
//             setTranspilerGoal(foreman.GOAL_TRANSPILE)
//           )
//           break
//         case workers.DONE:
//           store.dispatch(foreman.setGoal(foreman.GOAL_LINT))
//           store.dispatch(workers.workerReady(workers.WORKER_TRANSPILER))
//           break
//         case workers.OFFLINE:
//         case workers.BUSY:
//           // Wait
//           break
//         default:
//           throw new Error('Unexpected state reached.')
//       }
//       break
//     case foreman.GOAL_LINT:
//       switch (state.workers.getIn([workers.WORKER_LINTER, 'status'])) {
//         case workers.READY:
//           log.debug('Starting linter')
//           store.dispatch(workers.workerBusy(workers.WORKER_LINTER))
//           processes[workers.WORKER_LINTER].send(setLinterGoal(foreman.GOAL_LINT))
//           break
//         case workers.DONE:
//           store.dispatch(foreman.setGoal(foreman.GOAL_TEST))
//           store.dispatch(workers.workerReady(workers.WORKER_LINTER))
//           break
//         case workers.OFFLINE:
//         case workers.BUSY:
//           // Wait
//           break
//         default:
//           throw new Error('Unexpected state reached.')
//       }
//       break
//     case foreman.GOAL_TEST:
//       break
//     default:
//       throw new Error('Foreman has no goal')
//   }
// }
