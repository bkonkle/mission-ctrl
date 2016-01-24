import {expect} from 'chai'
import {fromJS} from 'immutable'
import * as transpiler from './transpiler'
const reducer = transpiler.default

describe('state/transpiler', () => {

  describe('reducer', () => {

    it('handles FINISH events by setting status to STATUS_IDLE', () => {
      const action = transpiler.finish()
      const initialState = fromJS({status: transpiler.STATUS_IN_PROGRESS})
      const expected = fromJS({status: transpiler.STATUS_IDLE})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

    it('handles START events by setting status to STATUS_STARTING', () => {
      const action = transpiler.start()
      const initialState = fromJS({status: transpiler.STATUS_IDLE})
      const expected = fromJS({status: transpiler.STATUS_STARTING})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

    it('handles STARTED events by setting status to STATUS_IN_PROGRESS', () => {
      const action = transpiler.started()
      const initialState = fromJS({status: transpiler.STATUS_STARTING})
      const expected = fromJS({status: transpiler.STATUS_IN_PROGRESS})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

  })

})
