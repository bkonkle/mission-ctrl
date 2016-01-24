/* eslint no-console:0 */
import bunyan from 'bunyan'
import chalk from 'chalk'
import getConfig from './config'

export class PlainStream {
  constructor(level) {
    this.level = level
  }

  write(rec) {
    const prefix = message => {
      if (this.level < bunyan.INFO) {
        return `[${chalk.blue(rec.name)}] ${message}`
      }
      return message
    }

    if (rec.level < bunyan.INFO) {
      console.log(prefix(rec.msg))
    } else if (rec.level < bunyan.WARN) {
      console.info(prefix(rec.msg))
    } else if (rec.level < bunyan.ERROR) {
      if (typeof rec.msg === 'string') {
        rec.msg = chalk.yellow(rec.msg)
      }
      console.warn(prefix(rec.msg))
    } else {
      if (typeof rec.msg === 'string') {
        rec.msg = chalk.red(rec.msg)
      }
      console.error(prefix(rec.msg))
    }
  }
}

/**
 * Create a logger with the given name.
 *
 * @param {String} name - the name for the logger (usually the module being
 *                        logged in)
 * @param {Number} [level] - an optional override for the loglevel
 * @return {Object} - the bunyan logger object
 */
export default function createLogger(name, level) {
  const config = getConfig()

  let loglevel = bunyan.INFO
  if (config.verbose) {
    loglevel = bunyan.DEBUG
  } else if (config.quiet) {
    loglevel = bunyan.WARN
  } else if (config.silent) {
    loglevel = bunyan.ERROR
  }

  const settings = {
    name,
    streams: [
      {
        level: level || loglevel,
        type: 'raw',
        stream: new PlainStream(level || loglevel),
      },
    ],
  }

  return bunyan.createLogger(settings)
}
