import compile from 'babel-cli/lib/babel/dir'
import {sync as glob} from 'glob'

export function compileToDir(source, opts) {
  const defaults = {
    outDir: null,
    sourceMaps: true,
    watch: false,
  }

  const options = {...defaults, ...opts}

  const filenames = glob(source)

  compile(options, filenames)
}
