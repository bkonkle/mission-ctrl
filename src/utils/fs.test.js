import {expect} from 'chai'
import {memfs, outputToMemFs} from './fs'

describe('utils/fs', () => {

  describe('outputToMemFs()', () => {

    it('saves the requested file to the virtual filesystem', () => {
      const code = 'export const test = \'test\''
      outputToMemFs('/test.js', code)

      const stat = memfs.statSync('/test.js')
      expect(stat.isDirectory()).to.be.false
      expect(stat.isFile()).to.be.true

      expect(memfs.readFileSync('/test.js').toString()).to.equal(code)
    })

    it('creates intermediate directories as needed', () => {
      const code = 'export const test = \'test\''
      outputToMemFs('/reach/for/the/sky.js', code)

      let stat = memfs.statSync('/reach/for')
      expect(stat.isDirectory()).to.be.true
      expect(stat.isFile()).to.be.false

      stat = memfs.statSync('/reach/for/the/sky.js')
      expect(stat.isDirectory()).to.be.false
      expect(stat.isFile()).to.be.true

      expect(memfs.readFileSync('/reach/for/the/sky.js').toString()).to.equal(code)
    })

  })

})
