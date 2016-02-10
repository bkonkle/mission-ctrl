import {outputTo} from 'utils/fs'
import {transformFileSync} from 'babel-core'
import chalk from 'chalk'
import createLogger from 'utils/logging'
import fs from 'fs'
import getConfig from 'utils/config'
import path from 'path'

const log = createLogger('utils/babel')

/**
 * Compiles the given filenames to the destination
 *
 * @param {String} options.baseDir - the base directory for relative paths
 * @param {Boolean} [options.copyFiles] - whether to copy files to the
 *   destination that weren't transformed by Babel, defaults to false
 * @param {String} options.outDir - the destination directory
 * @param {Array} options.filenames - an array of filenames to transform
 */
export function transpile({baseDir, copyFiles = false, outDir, filenames}) {
  const config = getConfig()

  filenames.forEach(filename => {
    // remove extension and then append back on .js
    const relative = path.relative(
      path.resolve(baseDir),
      filename.replace(/\.(\w*?)$/, '') + '.js'
    )
    const dest = path.resolve(path.join(outDir, relative))

    const data = transformFileSync(filename, {
      sourceMaps: true,
      sourceFileName: path.relative(path.dirname(dest), filename),
      sourceMapTarget: path.basename(dest),
    })
    if (!copyFiles && data.ignored) return

    const mode = fs.statSync(filename).mode

    // Output source map
    const mapLoc = dest + '.map'
    data.code = addSourceMappingUrl(data.code, mapLoc)
    outputTo(mapLoc, JSON.stringify(data.map))
    fs.chmodSync(mapLoc, mode)

    // Output transpiled file
    outputTo(dest, data.code)
    fs.chmodSync(dest, mode)

    log.info(`${filename} ${chalk.blue('-->')} ${chalk.green(path.join(config.dest, relative))}`)
  })
}

export function addSourceMappingUrl(code, loc) {
  return code + '\n//# sourceMappingURL=' + path.basename(loc)
}
