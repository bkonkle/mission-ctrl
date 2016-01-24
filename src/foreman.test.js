import {expect} from 'chai'
import {mockStore} from 'utils/test'
import {ready} from 'state/workers'
import {setGoal, GOAL_TRANSPILE} from 'state/foreman'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('foreman', () => {

  const forkStub = sinon.stub()

  const {init} = proxyquire('./foreman', {
    'child_process': {fork: forkStub},
  })

  afterEach(() => {
    forkStub.reset()
  })

  describe('init()', () => {

    let callback

    before(() => {
      forkStub.returns({
        on: (event, cb) => {
          callback = cb
        },
      })
    })

    it('spawns a transpiler worker', () => {
      init()
      expect(forkStub).to.have.been.calledWith(require.resolve('workers/transpiler'))
    })

    it('dispatches actions from worker messages', done => {
      const store = mockStore({}, [
        setGoal(GOAL_TRANSPILE),
        ready('transpiler'),
      ], done)

      store.subscribe = () => {}

      init(store)

      callback(ready('transpiler'))
    })

  })

})
