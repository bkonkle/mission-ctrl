import {call, put, take} from 'redux-saga'
import {CLIEngine} from 'eslint'
import {done, LINT} from 'state/linter'
import {expect} from 'chai'
import {WORKER_LINTER, workerDone} from 'state/workers'
import initLinter, {getEngine, lint, logReport} from './linter'

describe('sagas/linter', () => {

  describe('initLinter()', () => {
    const generator = initLinter()

    it('waits for LINT events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(LINT))
    })

    it('calls the linter', () => {
      const result = generator.next(lint)
      expect(result.value).to.deep.equal(call(lint))
    })

    it('updates state to done', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(put(done()))
    })

    it('sends a worker done message to the foreman', () => {
      const result = generator.next()
      expect(result.value.CALL.fn).to.have.property('name', 'bound proxy')
      expect(result.value.CALL.args[0]).to.deep.equal(workerDone(WORKER_LINTER))
    })

    it('goes back to waiting for lint events', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(take(LINT))
    })

  })

  describe('getEngine()', () => {

    it('returns an ESLint CLIEngine instance', () => {
      const result = getEngine()
      expect(result).to.be.an.instanceof(CLIEngine)
    })

  })

  describe('lint()', () => {
    const generator = lint()
    const linter = {executeOnFiles: () => {}}
    const report = {results: {result: 'test'}}

    it('gets an ESLint CLIEngine instance', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(getEngine))
    })

    it('calls the linter on the source', () => {
      const result = generator.next(linter)
      expect(result.value).to.deep.equal(call(linter.executeOnFiles, ['src']))
    })

    it('calls logReport if there were results', () => {
      const result = generator.next(report)
      expect(result.value).to.deep.equal(call(logReport, report))
    })

    it('ends the saga', () => {
      const result = generator.next()
      expect(result.done).to.be.true
    })

  })

  describe('logReport()', () => {
    const info = () => {}
    const formatter = () => {}
    const report = {results: {result: 'test'}}
    let generator = logReport(report, info)

    it('gets a formatter', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(CLIEngine.getFormatter))
    })

    it('calls the formatter to get results', () => {
      const result = generator.next(formatter)
      expect(result.value).to.deep.equal(call(formatter, report.results))
    })

    it('logs the results', () => {
      const result = generator.next('Test results')
      expect(result.value).to.deep.equal(call(info, 'Test results'))
    })

    it('ends the saga', () => {
      const result = generator.next()
      expect(result.done).to.be.true
    })

    it('logs a fun message when there are no results', () => {
      const emptyReport = {}
      generator = logReport(emptyReport, info)
      generator.next()  // yields call(CLIEngine.getFormatter)
      generator.next(formatter)  // yields call(formatter, report.results)
      let result = generator.next()

      expect(result.value.CALL.fn).to.deep.equal(info)

      result = generator.next()
      expect(result.done).to.be.true
    })

  })

})
