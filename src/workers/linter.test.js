import {CLIEngine} from 'eslint'
import {expect} from 'chai'
import {workerDone, WORKER_LINTER} from 'state/workers'
import chalk from 'chalk'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('workers/linter', () => {
  const linterSpy = sinon.spy()
  const mockEslint = {
    CLIEngine: () => ({
      executeOnFiles: linterSpy,
    }),
  }
  mockEslint.CLIEngine.getFormatter = CLIEngine.getFormatter

  const linter = proxyquire('./linter', {
    'eslint': mockEslint,
  })

  beforeEach(() => {
    linterSpy.reset()
  })

  describe('lint()', () => {

    it('runs linter.executeOnFiles on the source directory', () => {
      linter.lint()
      expect(linterSpy).to.have.been.calledWith(['src'])
    })

  })

  describe('logReport()', () => {

    const mockResults = {
      results: [{
        filePath: '/code/src/components/ecosystems/layout/index.jsx',
        messages: [{
          ruleId: 'comma-dangle',
          severity: 2,
          message: 'Missing trailing comma.',
          line: 2,
          column: 23,
          nodeType: 'ExportDefaultSpecifier',
          source: 'export RightNavSection from \'./right-nav-section\'',
        }, {
          ruleId: 'semi',
          severity: 2,
          message: 'Extra semicolon.',
          line: 3,
          column: 1,
          nodeType: 'ExportNamedDeclaration',
          source: ';',
          fix: {range: [{}], text: ''},
        }],
        errorCount: 2,
        warningCount: 0,
      }, {
        filePath: '/code/src/utils/text.js',
        messages: [],
        errorCount: 0,
        warningCount: 0,
      }],
      errorCount: 2,
      warningCount: 0,
    }

    it('formats and logs the results', () => {
      const expected = `
/code/src/components/ecosystems/layout/index.jsx
  2:23  error  Missing trailing comma  comma-dangle
  3:1   error  Extra semicolon         semi

✖ 2 problems (2 errors, 0 warnings)
`
      const infoSpy = sinon.spy()

      linter.logReport(mockResults, infoSpy)

      expect(infoSpy).to.have.been.calledOnce
      expect(chalk.stripColor(infoSpy.firstCall.args[0])).to.equal(expected)
    })

  })

})
