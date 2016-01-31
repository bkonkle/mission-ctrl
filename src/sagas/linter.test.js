import {call, put, take} from 'redux-saga'
import {done, LINT} from 'state/linter'
import {expect} from 'chai'
import {lint} from 'workers/linter'
import {WORKER_LINTER, workerDone} from 'state/workers'
import initLinter from './linter'

describe('sagas/linter', () => {

  describe('initLinter()', () => {
    const generator = initLinter()

    it('waits for LINT events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(LINT))
    })

    it('calls the linter', () => {
      const result = generator.next(lint())
      expect(result.value).to.deep.equal(call(lint))
    })

    it('updates state to done', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(done()))
    })

  })

})
