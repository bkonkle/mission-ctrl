import {expect} from 'chai'
import {fromJS} from 'immutable'
import {GOAL_LINT} from 'state/foreman'
import {inProgress} from 'workers/linter/state'
import {mockStore} from 'utils/test'
import {workerBusy, workerReady, WORKER_LINTER} from 'workers/state'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('workers/linter', () => {

  const linterStub = sinon.spy()

  const linter = proxyquire('./index', {
    'eslint': {CLIEngine: () => ({executeOnFiles: linterStub})},
  })

  beforeEach(() => {
    linterStub.reset()
  })

  describe('lint()', () => {

    it('updates status before and after', done => {
      const expectedActions = [inProgress(true), inProgress(false)]
      const store = mockStore({}, expectedActions, done)

      linter.lint(store)

      expect(process.send).to.have.been.calledWith(workerBusy(WORKER_LINTER))
      expect(process.send).to.have.been.calledWith(workerReady(WORKER_LINTER))
    })

    it('runs linter.executeOnFiles on the source directory')

    it('reports the results in a log grouped by file')

  })

  describe('stateChanged()', () => {

    describe('GOAL_LINT', () => {

      it('runs the linter', () => {
        const store = {
          dispatch: () => {},
          getState: () => ({
            linter: fromJS({goal: GOAL_LINT, inProgress: false}),
          }),
        }

        linter.stateChanged(store)

        expect(linterStub).to.have.been.calledWith(['src'])
      })

    })

  })

})
