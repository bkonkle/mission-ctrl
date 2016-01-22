import findup from 'findup-sync'
import minimist from 'minimist'

const DEFAULTS = {
  verbose: false,
}

export default function getConfig(argv) {
  const args = argv || process.argv.slice(2)

  const options = minimist(args, {
    alias: {verbose: 'v'},
    boolean: ['verbose', 'quiet', 'silent'],
  })

  const config = findup('.shipyardrc')

  return {...DEFAULTS, ...config, ...options}
}
