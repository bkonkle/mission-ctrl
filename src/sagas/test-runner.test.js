import {apply, call, put, take} from 'redux-saga'
import {expect} from 'chai'
import {sync as glob} from 'glob'
import {sync as mkdirp} from 'mkdirp'
import {TEST, done} from 'state/test-runner'
import {tmp} from 'utils/fs'
import {WORKER_TEST_RUNNER, workerReady} from 'state/workers'
import chalk from 'chalk'
import fs from 'fs'
import initTestRunner, {clearCache, runTests, logResults} from './test-runner'
import path from 'path'
import sinon from 'sinon'

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
    const mocha = {files: [], run: () => {}, addFile: sinon.spy()}
    const generator = runTests({dest: 'test', glob: '*'}, mocha)

    before(() => {
      mkdirp(tmp('test/utils'))
      fs.writeFileSync(tmp('test/utils/test-setup.js'), '{}')
    })

    it('gets the filenames to test from the temp directory', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(glob, tmp(path.join('test', '*'))))
    })

    it('runs the tests', () => {
      const files = ['index.js', 'index.test.js']
      const result = generator.next(files)
      expect(mocha.addFile).to.have.been.calledTwice
      expect(result.value).to.deep.equal(apply(mocha, mocha.run, [logResults]))
    })

    it('clears the require cache', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(clearCache))
    })

    it('ends the saga', () => {
      const result = generator.next()
      expect(result.done).to.be.true
    })

  })

})
