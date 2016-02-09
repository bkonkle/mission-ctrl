import {apply, call, put, take} from 'redux-saga'
import {expect} from 'chai'
import {TEST, done} from 'state/test-runner'
import {WORKER_TEST_RUNNER, workerReady} from 'state/workers'
import initTestRunner, {runTests} from './test-runner'

describe('sagas/test-runner', () => {

  describe('initTestRunner()', () => {
    const generator = initTestRunner()

    it('waits for TEST events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(TEST))
    })

    it('runs the tests', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(runTests))
    })

    it('updates state to done', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(done()))
    })

    it('sends a worker ready message to the foreman', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(apply(process, process.send, workerReady(WORKER_TEST_RUNNER)))
    })

    it('goes back to waiting for TEST events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(TEST))
    })

  })

  describe('runTests()', () => {
    const generator = runTests()
    const testRunner = {}

    it('ends the saga', () => {
      const result = generator.next()
      expect(result.done).to.be.true
    })

  })

})
