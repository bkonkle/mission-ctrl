import {outputToMemFs} from 'utils/fs'
import {transformFileSync} from 'babel-core'
import createLogger from 'utils/logging'
import fs from 'fs'
import path from 'path'
import slash from 'slash'

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
  filenames.forEach(filename => {
    // remove extension and then append back on .js
    const relative = path.relative(baseDir, filename.replace(/\.(\w*?)$/, '') + '.js')

    const dest = path.join(outDir, relative)

    const data = transformFileSync(filename, {
      sourceFileName: slash(path.relative(dest + '/..', filename)),
      sourceMapTarget: path.basename(relative),
    })
    if (!copyFiles && data.ignored) return

    // Output source map
    const mapLoc = dest + '.map'
    data.code = addSourceMappingUrl(data.code, mapLoc)
    outputToMemFs(mapLoc, JSON.stringify(data.map))

    // Output transpiled file
    outputToMemFs(dest, data.code)
    fs.chmodSync(dest, fs.statSync(filename).mode)

    log.debug(filename + ' -> ' + dest)
  })
}

export function addSourceMappingUrl(code, loc) {
  return code + '\n//# sourceMappingURL=' + path.basename(loc)
}
