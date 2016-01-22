import {expect} from 'chai'
import {fromJS} from 'immutable'
import reducer, {ready, STATUS_OFFLINE, STATUS_READY} from 'state/workers'

describe('state/workers', () => {

  describe('reducer()', () => {

    it('handles READY events', () => {
      const action = ready('transpiler')
      const initialState = fromJS({transpiler: {status: STATUS_OFFLINE}})
      const expected = fromJS({transpiler: {status: STATUS_READY, error: null}})

      const result = reducer(initialState, action)

      expect(result).to.equal(expected)
    })

  })

})
