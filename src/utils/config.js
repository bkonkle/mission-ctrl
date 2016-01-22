import findup from 'findup-sync'
import minimist from 'minimist'

export default function getConfig(argv) {
  const config = findup('.shipyardrc')

  const args = argv || process.argv.slice(2)
  const options = minimist(args, {
    alias: {verbose: 'v'},
    boolean: ['verbose', 'quiet', 'silent'],
    default: config,
  })

  return {...options}
}
