import {sync as mkdirp} from 'mkdirp'
import {sync as rimraf} from 'rimraf'
import fs from 'fs'
import getConfig from 'utils/config'
import path from 'path'

export const tearDown = {}

export function outputTo(filePath, data) {
  const createdDirPath = mkdirp(path.dirname(filePath))
  fs.writeFileSync(filePath, data)
  return createdDirPath
}

export function tmp(filePath, configOverride) {
  const config = configOverride || getConfig()

  if (!tearDown[config.tmpDir]) {
    process.on('exit', () => rimraf(config.tmpDir))
    tearDown[config.tmpDir] = true
  }

  return path.join(config.tmpDir, filePath)
}
