import {expect} from 'chai'
import {fromJS} from 'immutable'
import reducer, {done, lint} from './linter'

describe('state/linter', () => {

  describe('reducer', () => {

    describe('DONE', () => {

      it('sets the inProgress flag to false', () => {
        const action = done()
        const initialState = fromJS({inProgress: true})
        const expected = fromJS({inProgress: false})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

    describe('LINT', () => {

      it('sets the inProgress flag to true', () => {
        const action = lint()
        const initialState = fromJS({inProgress: false})
        const expected = fromJS({inProgress: true})

        const result = reducer(initialState, action)

        expect(result).to.equal(expected)
      })

    })

  })

})
