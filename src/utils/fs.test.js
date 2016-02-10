import {expect} from 'chai'
import {tempDir, outputTo, tmp} from './fs'
import fs from 'fs'

describe('utils/fs', () => {

  describe('outputToDir()', () => {

    it('saves the requested file to given destination', () => {
      const code = 'export const test = \'test\''
      outputTo(tmp('/test.js'), code)

      const stat = fs.statSync(tmp('/test.js'))
      expect(stat.isDirectory()).to.be.false
      expect(stat.isFile()).to.be.true

      expect(fs.readFileSync(tmp('/test.js')).toString()).to.equal(code)
    })

    it('creates intermediate directories as needed', () => {
      const code = 'export const test = \'test\''
      outputTo(tmp('/reach/for/the/sky.js'), code)

      let stat = fs.statSync(tmp('/reach/for'))
      expect(stat.isDirectory()).to.be.true
      expect(stat.isFile()).to.be.false

      stat = fs.statSync(tmp('/reach/for/the/sky.js'))
      expect(stat.isDirectory()).to.be.false
      expect(stat.isFile()).to.be.true

      expect(fs.readFileSync(tmp('/reach/for/the/sky.js')).toString()).to.equal(code)
    })

  })

  describe('tmp', () => {

    it('prefixes the given path with the tempDir', () => {
      const result = tmp('/path/to/test/file.js')
      expect(result).to.equal(`${tempDir}/path/to/test/file.js`)
    })

  })

})
