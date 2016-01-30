import {expect} from 'chai'
import {sourceChanged} from 'state/foreman'
import chalk from 'chalk'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

describe('workers/watcher', () => {
  const watchStub = sinon.stub().returns({on: () => {}})

  const watcher = proxyquire('./watcher', {
    'chokidar': {watch: watchStub},
  })

  beforeEach(() => {
    watchStub.reset()
  })

  describe('watch()', () => {

    it('starts a chokidar instance to watch the source', () => {
      watcher.watch()
      expect(watchStub).to.have.been.calledWith('src/**/*.js?(x)')
    })

  })

  describe('reportChange()', () => {

    it('reports the type of event and the path', () => {
      const event = 'change'
      const file = 'src/components/organisms/layout/index.jsx'
      const infoSpy = sinon.spy()
      const expected = `${event} --> ${file}`

      watcher.reportChange(event, file, infoSpy)

      expect(infoSpy).to.have.been.calledOnce
      expect(chalk.stripColor(infoSpy.firstCall.args[0])).to.equal(expected)
    })

    it('sends a CHANGE event to the foreman', () => {
      const event = 'change'
      const file = 'src/components/organisms/layout/index.jsx'
      const infoSpy = sinon.spy()

      watcher.reportChange(event, file, infoSpy)

      expect(process.send).to.have.been.calledWith(sourceChanged(file))
    })

  })

})
