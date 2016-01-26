import {expect} from 'chai'
import {fromJS} from 'immutable'
import reducer, {workerReady, OFFLINE, READY} from './workers'

describe('state/workers', () => {

  describe('reducer()', () => {

    describe('READY', () => {

      it('sets the status to READY', () => {
        const action = workerReady('transpiler')
        const initialState = fromJS({transpiler: {status: OFFLINE}})
        const expected = fromJS({transpiler: {status: READY, error: null}})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

  })

})
