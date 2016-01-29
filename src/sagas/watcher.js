import {GOAL_WATCH} from 'state/foreman'
import {startProcess} from 'utils/sagas'
import {WORKER_WATCHER} from 'state/workers'

export default startProcess(WORKER_WATCHER, GOAL_WATCH)
