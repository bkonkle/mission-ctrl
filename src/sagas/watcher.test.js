import {expect} from 'chai'
import startWatcher from './watcher'

describe('sagas/watcher', () => {

  describe('startWatcher()', () => {

    it('passes a worker id and exports the saga that is returned', () => {
      const generator = startWatcher()
      const result = generator.next()
      expect(result.value).to.have.property('FORK')
      expect(result.value.FORK).to.have.property('fn')
      expect(result.value.FORK.fn).to.have.property('name', 'startProcessSaga')
    })

  })

})
