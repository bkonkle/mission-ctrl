import {apply, call} from 'redux-saga'
import {expect} from 'chai'
import {sourceChanged} from 'state/foreman'
import chalk from 'chalk'
import chokidar from 'chokidar'
import initWatcher, {watch, reportChange} from './watcher'

describe('workers/watcher', () => {

  describe('initWatcher()', () => {
    const generator = initWatcher()

    it('immediately calls watch()', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(watch))
    })

    it('promptly ends', () => {
      const result = generator.next()
      expect(result.done).to.be.true
    })

  })

  describe('watch()', () => {
    const watcher = {on: () => {}}
    const generator = watch()

    it('starts a chokidar instance to watch the source', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(call(chokidar.watch, 'src/**/*.js?(x)', {ignoreInitial: true}))
    })

    it('attaches reportChange to handle all events', () => {
      const result = generator.next(watcher)
      expect(result.value).to.deep.equal(call(watcher.on, 'all', reportChange))
    })

    it('finishes the saga', () => {
      const result = generator.next()
      expect(result.done).to.be.true
    })

  })

  describe('reportChange()', () => {
    const event = 'change'
    const file = 'src/components/organisms/layout/index.jsx'
    const info = () => {}
    const generator = reportChange(event, file, info)

    it('reports the type of event and the path', () => {
      const result = generator.next()
      expect(chalk.stripColor(result.value.CALL.args[0])).to.equal(`${event} --> ${file}`)
    })

    it('sends a CHANGE event to the foreman', () => {
      const result = generator.next()
      expect(result.value).to.deep.equal(apply(process, process.send, sourceChanged(file)))
    })

  })

})
