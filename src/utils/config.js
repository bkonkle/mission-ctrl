import findup from 'findup-sync'
import minimist from 'minimist'

const DEFAULTS = {
  dest: 'build',
  glob: '**/*.js?(x)',
  production: false,
  source: 'src',
}

export default function getConfig(argv) {
  const config = findup('.shipyardrc')

  const args = argv || process.argv.slice(2)
  const options = minimist(args, {
    alias: {verbose: 'v'},
    boolean: ['verbose', 'quiet', 'silent'],
    default: {...DEFAULTS, ...config},
  })

  return {...options}
}
