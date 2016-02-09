import {expect} from 'chai'
import {tempDir, outputToTempDir} from './fs'
import fs from 'fs'
import path from 'path'

describe('utils/fs', () => {

  describe('outputToTempDir()', () => {

    it('saves the requested file to the auto-generated temporary directory', () => {
      const code = 'export const test = \'test\''
      outputToTempDir('/test.js', code)

      const stat = fs.statSync(path.join(tempDir, 'test.js'))
      expect(stat.isDirectory()).to.be.false
      expect(stat.isFile()).to.be.true

      expect(fs.readFileSync(path.join(tempDir, 'test.js')).toString()).to.equal(code)
    })

    it('creates intermediate directories as needed', () => {
      const code = 'export const test = \'test\''
      outputToTempDir('/reach/for/the/sky.js', code)

      let stat = fs.statSync(path.join(tempDir, '/reach/for'))
      expect(stat.isDirectory()).to.be.true
      expect(stat.isFile()).to.be.false

      stat = fs.statSync(path.join(tempDir, '/reach/for/the/sky.js'))
      expect(stat.isDirectory()).to.be.false
      expect(stat.isFile()).to.be.true

      expect(fs.readFileSync(path.join(tempDir, '/reach/for/the/sky.js')).toString()).to.equal(code)
    })

  })

})
