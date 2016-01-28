import {expect} from 'chai'
import {fromJS} from 'immutable'
import {GOAL_WATCH, sourceChanged} from 'state/foreman'
import {inProgress, setGoal} from 'workers/watcher/state'
import {mockStore} from 'utils/test'
import {WORKER_WATCHER, workerDone} from 'state/workers'
import chalk from 'chalk'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('workers/watcher', () => {
  const watchStub = sinon.stub().returns({on: () => {}})

  const watcher = proxyquire('./index', {
    'chokidar': {watch: watchStub},
  })

  beforeEach(() => {
    watchStub.reset()
  })

  describe('watch()', () => {

    it('updates status before and after', done => {
      const expectedActions = [inProgress(true), setGoal(null), inProgress(false)]
      const store = mockStore({}, expectedActions, done)

      watcher.watch(store)

      expect(process.send).to.have.been.calledWith(workerDone(WORKER_WATCHER))
    })

    it('starts a chokidar instance to watch the source', done => {
      const expectedActions = [inProgress(true), setGoal(null), inProgress(false)]
      const store = mockStore({}, expectedActions, done)

      watcher.watch(store)

      expect(watchStub).to.have.been.calledWith('src/**/*.js?(x)')
    })

  })

  describe('stateChanged()', () => {

    describe('GOAL_WATCH', () => {

      it('runs the watcher', () => {
        const store = {
          dispatch: () => {},
          getState: () => ({
            linter: fromJS({goal: GOAL_WATCH, inProgress: false}),
          }),
        }

        watcher.watch(store)

        expect(watchStub).to.have.been.calledWith('src/**/*.js?(x)')
      })

    })

  })

  describe('reportChange()', () => {

    it('reports the type of event and the path', () => {
      const event = 'change'
      const file = 'src/components/organisms/layout/index.jsx'
      const infoSpy = sinon.spy()
      const expected = `${event} --> ${file}`

      watcher.reportChange(event, file, infoSpy)

      expect(infoSpy).to.have.been.calledOnce
      expect(chalk.stripColor(infoSpy.firstCall.args[0])).to.equal(expected)
    })

    it('sends a CHANGE event to the foreman', () => {
      const event = 'change'
      const file = 'src/components/organisms/layout/index.jsx'
      const infoSpy = sinon.spy()

      watcher.reportChange(event, file, infoSpy)

      expect(process.send).to.have.been.calledWith(sourceChanged())
    })

  })

})
