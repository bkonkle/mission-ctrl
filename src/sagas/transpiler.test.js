import {expect} from 'chai'
import {fromJS} from 'immutable'
import {call, fork, take, put} from 'redux-saga'
import {notifyForeman, watchProcess} from 'utils/sagas'
import {transpile} from 'workers/transpiler'
import * as foreman from 'state/foreman'
import * as workers from 'state/workers'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('sagas/transpiler', () => {
  const mockProcess = {on: sinon.spy(), send: sinon.spy()}
  const forkStub = sinon.stub().returns(mockProcess)

  const transpiler = proxyquire('./transpiler', {
    'utils/workers': {forkWorker: forkStub},
  })

  beforeEach(() => {
    mockProcess.on.reset()
    mockProcess.send.reset()
    forkStub.reset()
  })

  describe('startTranspiler()', () => {

    it('waits for a SET_GOAL event', () => {
      const getState = () => {}
      const generator = transpiler.startTranspiler(getState)

      const result = generator.next()

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

    it('does nothing if the event goal is not GOAL_TRANSPILE', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.READY}}),
      })
      const generator = transpiler.startTranspiler(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      const result = generator.next(foreman.setGoal(foreman.GOAL_LINT))

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

    it('marks the transpiler as busy before launching it', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.OFFLINE}}),
      })
      const generator = transpiler.startTranspiler(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      const result = generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))  // put(workers.workerBusy(workers.WORKER_TRANSPILER))

      expect(result.value).to.deep.equal(put(workers.workerBusy(workers.WORKER_TRANSPILER)))
    })

    it('launches the transpiler process if it is offline', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.OFFLINE}}),
      })
      const generator = transpiler.startTranspiler(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))  // yields put(workers.workerBusy(workers.WORKER_TRANSPILER))
      generator.next()  // yields call(watchProcess, watcher)

      expect(forkStub).to.have.been.calledWith('transpiler')
    })

    it('creates a process transpiler to monitor messages from the foreman', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.OFFLINE}}),
      })
      const generator = transpiler.startTranspiler(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))  // yields put(workers.workerBusy(workers.WORKER_TRANSPILER))
      const result = generator.next()

      expect(result.value).to.deep.equal(call(watchProcess, mockProcess))
    })

    it('forks a notify process to accept messages from the foreman', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.OFFLINE}}),
      })
      const generator = transpiler.startTranspiler(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))  // yields put(workers.workerBusy(workers.WORKER_TRANSPILER))
      generator.next()  // yields call(watchProcess, transpiler)
      const result = generator.next(processWatcher)

      expect(result.value).to.deep.equal(fork(notifyForeman, processWatcher))
    })

    it('waits for the transpiler to be ready', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.OFFLINE}}),
      })
      const generator = transpiler.startTranspiler(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))  // yields put(workers.workerBusy(workers.WORKER_TRANSPILER))
      generator.next()  // yields call(watchProcess, transpiler)
      generator.next(processWatcher)  // yields fork(notifyForeman, processWatcher)
      const result = generator.next()

      expect(result.value).to.deep.equal(take(workers.READY))
    })

    it('continues waiting if a ready event for another worker is dispatched', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.OFFLINE}}),
      })
      const generator = transpiler.startTranspiler(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)
      generator.next(processWatcher)  // yields fork(notifyForeman, processWatcher)
      generator.next()  // yields take(workers.READY)
      const result = generator.next(workers.workerReady(workers.WORKER_LINTER))

      expect(result.value).to.deep.equal(take(workers.READY))
    })

    it('runs a transpile after launching the transpiler process', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.OFFLINE}}),
      })
      const generator = transpiler.startTranspiler(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))  // yields put(workers.workerBusy(workers.WORKER_TRANSPILER))
      generator.next()  // yields call(watchProcess, transpiler)
      generator.next(processWatcher)  // yields fork(notifyForeman, processWatcher)
      generator.next()  // yields take(workers.READY)
      const result = generator.next(workers.workerReady(workers.WORKER_TRANSPILER))

      expect(result.value).to.deep.equal(call(transpile))
    })

    it('returns to watching for SET_GOAL events after it is done', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.OFFLINE}}),
      })
      const generator = transpiler.startTranspiler(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)
      generator.next(processWatcher) // yields fork(notifyForeman, processWatcher)
      generator.next()  // yields take(workers.READY)
      generator.next(workers.workerReady(workers.WORKER_TRANSPILER))  // yields call(transpile)
      const result = generator.next()

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

    it('does nothing if the transpiler is otherwise not ready', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_TRANSPILER]: {status: workers.BUSY}}),
      })
      const generator = transpiler.startTranspiler(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      const result = generator.next(foreman.setGoal(foreman.GOAL_TRANSPILE))

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

  })

})
