import babel from 'babel-core'
import createLogger from 'utils/logging'
import fs from 'fs'
import outputFileSync from 'output-file-sync'
import path from 'path'
import pathExists from 'path-exists'
import readdir from 'fs-readdir-recursive'
import slash from 'slash'

const log = createLogger('utils/babel')

export function chmod(src, dest) {
  fs.chmodSync(dest, fs.statSync(src).mode)
}

export function shouldIgnore(loc, ignore, only) {
  return babel.util.shouldIgnore(loc, ignore, only)
}

export function addSourceMappingUrl(code, loc) {
  return code + '\n//# sourceMappingURL=' + path.basename(loc)
}

export function transform(filename, code, options) {
  options.filename = filename
  options.ignore = null
  options.only = null

  const result = babel.transform(code, options)
  result.filename = filename
  result.actual = code
  return result
}

export function compile(filename, options) {
  const code = fs.readFileSync(filename, 'utf8')
  return transform(filename, code, options)
}

/**
 * Compiles the given filenames to the outDir. Taken from babel-cli.
 * @param {Object} options
 * @param {Array} filenames
 */
export function transpileToDir(options, filenames) {
  function write(src, rel) {
    // remove extension and then append back on .js
    const relative = rel.replace(/\.(\w*?)$/, '') + '.js'

    const dest = path.join(options.outDir, relative)

    const data = compile(src, {
      sourceFileName: slash(path.relative(dest + '/..', src)),
      sourceMapTarget: path.basename(relative),
    })
    if (!options.copyFiles && data.ignored) return

    // we've requested explicit sourcemaps to be written to disk
    if (data.map && options.sourceMaps && options.sourceMaps !== 'inline') {
      const mapLoc = dest + '.map'
      data.code = addSourceMappingUrl(data.code, mapLoc)
      outputFileSync(mapLoc, JSON.stringify(data.map))
    }

    outputFileSync(dest, data.code)
    chmod(src, dest)

    log.debug(src + ' -> ' + dest)
  }

  function handleFile(src, filename) {
    if (shouldIgnore(src, options.ignore, options.only)) return

    if (babel.util.canCompile(filename, options.extensions)) {
      write(src, filename)
    } else if (options.copyFiles) {
      const dest = path.join(options.outDir, filename)
      outputFileSync(dest, fs.readFileSync(src))
      chmod(src, dest)
    }
  }

  function handle(filename) {
    if (!pathExists.sync(filename)) return

    const stat = fs.statSync(filename)

    if (stat.isDirectory(filename)) {
      const dirname = filename

      readdir(dirname).forEach(file => {
        const src = path.join(dirname, file)
        handleFile(src, filename)
      })
    } else {
      write(filename, filename)
    }
  }

  filenames.forEach(handle)
}
