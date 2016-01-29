import {call, fork, put, take} from 'redux-saga'
import {expect} from 'chai'
import {fromJS} from 'immutable'
import * as foreman from 'state/foreman'
import * as workers from 'state/workers'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('utils/sagas', () => {

  const mockProcess = {on: sinon.spy(), send: sinon.spy()}
  const forkStub = sinon.stub().returns(mockProcess)

  const sagas = proxyquire('./sagas', {
    'utils/workers': {forkWorker: forkStub},
  })

  beforeEach(() => {
    mockProcess.on.reset()
    mockProcess.send.reset()
    forkStub.reset()
  })

  describe('startProcess()', () => {

    it('takes a worker id and returns a saga', () => {
      const result = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      expect(result).to.be.a.function
    })

    it('waits for a SET_GOAL event', () => {
      const getState = () => {}
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)

      const result = generator.next()

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

    it('does nothing if the event goal is not the target goal', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.READY}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      const result = generator.next(foreman.setGoal(foreman.GOAL_LINT))

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

    it('marks the process as busy before launching it', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      const result = generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // put(workers.workerBusy(workers.WORKER_WATCHER))

      expect(result.value).to.deep.equal(put(workers.workerBusy(workers.WORKER_WATCHER)))
    })

    it('launches the process if it is offline', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)

      expect(forkStub).to.have.been.calledWith(workers.WORKER_WATCHER)
    })

    it('creates a process watcher to monitor messages from the foreman', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      const result = generator.next()

      expect(result.value).to.deep.equal(call(sagas.watchProcess, mockProcess))
    })

    it('forks a notify process to accept messages from the foreman', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)
      const result = generator.next(processWatcher)

      expect(result.value).to.deep.equal(fork(sagas.notifyForeman, processWatcher))
    })

    it('waits for the watcher to be ready', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)
      generator.next(processWatcher)  // yields fork(notifyForeman, processWatcher)
      const result = generator.next()

      expect(result.value).to.deep.equal(take(workers.READY))
    })

    it('continues waiting if a ready event for another worker is dispatched', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)
      generator.next(processWatcher)  // yields fork(notifyForeman, processWatcher)
      generator.next()  // yields take(workers.READY)
      const result = generator.next(workers.workerReady(workers.WORKER_LINTER))

      expect(result.value).to.deep.equal(take(workers.READY))
    })

    it('returns to watching for SET_GOAL events after it is done launching', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)
      generator.next(processWatcher) // yields fork(notifyForeman, processWatcher)
      generator.next() // take(workers.READY)
      const result = generator.next(workers.workerReady(workers.WORKER_WATCHER))

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

    it('does nothing if the watcher is otherwise not ready', () => {
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.BUSY}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH)
      const generator = saga(getState)

      generator.next()  // yields take(foreman.SET_GOAL)
      const result = generator.next(foreman.setGoal(foreman.GOAL_WATCH))

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

    it('calls a callback after launching the process if one was specified', () => {
      const callback = sinon.spy()
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH, callback)
      const generator = saga(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)
      generator.next(processWatcher) // yields fork(notifyForeman, processWatcher)
      generator.next()  // yields take(workers.READY)
      const result = generator.next(workers.workerReady(workers.WORKER_WATCHER))

      expect(result.value).to.deep.equal(call(callback))
    })

    it('returns to watching SET_GOAL after the callback was called', () => {
      const callback = sinon.spy()
      const getState = () => ({
        workers: fromJS({[workers.WORKER_WATCHER]: {status: workers.OFFLINE}}),
      })
      const saga = sagas.startProcess(workers.WORKER_WATCHER, foreman.GOAL_WATCH, callback)
      const generator = saga(getState)
      const processWatcher = {}

      generator.next()  // yields take(foreman.SET_GOAL)
      generator.next(foreman.setGoal(foreman.GOAL_WATCH))  // yields put(workers.workerBusy(workers.WORKER_WATCHER))
      generator.next()  // yields call(watchProcess, watcher)
      generator.next(processWatcher) // yields fork(notifyForeman, processWatcher)
      generator.next()  // yields take(workers.READY)
      generator.next(workers.workerReady(workers.WORKER_WATCHER))  // yields call(callback)
      const result = generator.next()

      expect(result.value).to.deep.equal(take(foreman.SET_GOAL))
    })

  })

  describe('watchProcess()', () => {

    it('attaches an "on" callback to the process', () => {
      sagas.watchProcess(mockProcess)
      expect(mockProcess.on).to.have.been.calledOnce
    })

    it('returns an object with a function that returns a promise for the next message', () => {
      const processWatcher = sagas.watchProcess(mockProcess)
      expect(processWatcher).to.have.property('nextMessage').and.be.a.function
      const callback = mockProcess.on.firstCall.args[1]
      expect(callback).to.be.a.function

      const promise = processWatcher.nextMessage()
      callback(workers.workerBusy(workers.WORKER_WATCHER))

      expect(promise).to.eventually.equal(workers.workerBusy(workers.WORKER_WATCHER))
    })

  })

  describe('notifyForeman()', () => {

    it('calls nextMessage on the process watcher', () => {
      const messageSource = {nextMessage: () => {}}
      const generator = sagas.notifyForeman(messageSource)

      const result = generator.next()
      expect(result.value).to.deep.equal(call(messageSource.nextMessage))
    })

    it('dispatches any messages received', () => {
      const messageSource = {nextMessage: () => {}}
      const generator = sagas.notifyForeman(messageSource)
      generator.next()  // yields call(messageSource.nextMessage)

      const result = generator.next(workers.workerBusy(workers.WORKER_WATCHER))

      expect(result.value).to.deep.equal(put(workers.workerBusy(workers.WORKER_WATCHER)))
    })

  })

})
