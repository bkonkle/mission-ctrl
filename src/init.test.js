import {setGoal, GOAL_WATCH} from 'state/foreman'
import configureStore from 'redux-mock-store'
import init from './init'

const mockStore = configureStore([])

describe('init', () => {

  describe('init()', () => {

    it('dispatches an initial GOAL_WATCH event', done => {
      const store = mockStore({}, [setGoal(GOAL_WATCH)], done)
      init(store)
    })

  })

})
