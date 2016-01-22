import {getConfig} from 'utils/config'
import {ready} from 'state/workers'
import babel from 'babel'
import createLogger from 'utils/logging'
import {sync as glob} from 'glob'

const log = createLogger('compiler')

export function compile() {
  const config = getConfig()
  const files = glob(config.source)

  if (files) {
    files.forEach(filename => {
      const content = babel.transformFileSync(filename)
      log.debug('Compiled output:', content)
    })
  }
}

export default function compiler() {
  this.postMessage(ready('compiler'))

  // TODO: Send messages received from the foreman through a redux reducer

  log.debug('Compiler process ready.')
}
