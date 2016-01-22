import {expect} from 'chai'
import {ready} from 'state/workers'
import compiler from 'workers/compiler'
import sinon from 'sinon'

describe('workers/compiler', () => {

  describe('compiler()', () => {

    it('posts a ready message to the foreman', () => {
      const context = {postMessage: sinon.spy()}
      compiler.call(context)
      expect(context.postMessage).to.have.been.calledWith(ready('compiler'))
    })

  })

})
