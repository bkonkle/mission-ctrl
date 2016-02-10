import {expect} from 'chai'
import {fromJS} from 'immutable'
import * as foreman from './foreman'

const reducer = foreman.default

describe('state/foreman', () => {

  describe('reducer', () => {

    describe('SOURCE_CHANGED', () => {

      it('doesn\'t do anything at the moment', () => {
        const action = foreman.sourceChanged()
        const initialState = fromJS({})
        const expected = fromJS({})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

  })

})
