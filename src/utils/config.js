import {tmpdir} from 'os'
import findup from 'findup-sync'
import minimist from 'minimist'
import path from 'path'
import uuid from 'uuid'

const DEFAULTS = {
  dest: 'build',
  glob: '**/*.js?(x)',
  production: false,
  silent: false,
  source: 'src',
  tmpDir: path.join(tmpdir(), `ship-yard-${uuid.v4()}`),
  trace: false,
  verbose: false,
}

export default function getConfig(argv) {
  const config = findup('.shiprc')

  const args = argv || process.argv.slice(2)
  const options = minimist(args, {
    alias: {verbose: 'v'},
    boolean: ['verbose', 'quiet', 'silent', 'trace'],
    default: {...DEFAULTS, ...config},
  })

  if (options.trace) options.verbose = true

  return {...options}
}
