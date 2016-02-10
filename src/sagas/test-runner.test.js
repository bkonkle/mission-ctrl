import {apply, call, put, take} from 'redux-saga'
import {expect} from 'chai'
import {sync as glob} from 'glob'
import {tmp} from 'utils/fs'
import {TEST, done} from 'state/test-runner'
import {WORKER_TEST_RUNNER, workerReady} from 'state/workers'
import chalk from 'chalk'
import initTestRunner, {clearCache, runTests, logResults} from './test-runner'
import path from 'path'

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
      expect(result.value).to.deep.equal(apply(process, process.send, [workerReady(WORKER_TEST_RUNNER)]))
    })

    it('goes back to waiting for TEST events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(TEST))
    })

  })

  describe('runTests()', () => {
    const mocha = {files: [], run: () => {}}
    const generator = runTests({dest: 'test', glob: '*'}, mocha)

    it('gets the filenames to test from the temp directory', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(glob, tmp(path.join('test', '*'))))
    })

    it('runs the tests', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(apply(mocha, mocha.run, [logResults]))
    })

    it('clears the require cache', () => {
      const result = generator.next()
      expect(result.done).to.be.true
      expect(result.value).to.deep.equal(call(clearCache))
    })

  })

  describe('logResults()', () => {
    const info = () => {}

    it('logs the results of the test run and ends the saga', () => {
      const generator = logResults(4, info)
      const result = generator.next()
      expect(result.done).to.be.true
      expect(result.value).to.have.property('CALL')
      expect(result.value.CALL.fn).to.equal(info)
      expect(result.value.CALL.args).to.deep.equal([chalk.red('4 tests failed.')])
    })

    it('logs a positive result when there are no failures', () => {
      const generator = logResults(0, info)
      const result = generator.next()
      expect(result.done).to.be.true
      expect(result.value).to.have.property('CALL')
      expect(result.value.CALL.fn).to.equal(info)
      expect(result.value.CALL.args).to.deep.equal([chalk.green('All tests passed! 👍')])
    })

  })

  describe('clearCache()', () => {

    it('deletes all existing keys in require.cache', () => {
      const req = {cache: {'./src/init.js': true}}
      clearCache(req)
      expect(req.cache).to.be.empty
    })

    it('skips compiled C/C++ extensions', () => {
      const req = {cache: {'wicked-fast.node': true}}
      clearCache(req)
      expect(req.cache).to.deep.equal({'wicked-fast.node': true})
    })

  })

})
