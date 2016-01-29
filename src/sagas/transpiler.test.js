import {call} from 'redux-saga'
import {expect} from 'chai'
import {transpile} from 'workers/transpiler'
import * as transpiler from './transpiler'

describe('sagas/transpiler', () => {

  describe('startTranspiler()', () => {

    it('passes a worker id and exports the saga that is returned', () => {
      const generator = transpiler.default()
      const result = generator.next()
      expect(result.value).to.have.property('FORK')
      expect(result.value.FORK).to.have.property('fn')
      expect(result.value.FORK.fn).to.have.property('name', 'startProcessSaga')
    })

  })

  describe('runTranspiler()', () => {

    it('calls the transpiler', () => {
      const generator = transpiler.runTranspiler()
      const result = generator.next()
      expect(result.value).to.deep.equal(call(transpile))
    })

  })

})
