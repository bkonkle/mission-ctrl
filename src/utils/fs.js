import {sync as mkdirp} from 'mkdirp'
import {sync as rimraf} from 'rimraf'
import {tmpdir} from 'os'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'

export const tempDir = path.join(tmpdir(), `ship-yard-${uuid.v4()}`)
process.on('exit', () => rimraf(tempDir))

export function outputTo(filePath, data) {
  const createdDirPath = mkdirp(path.dirname(filePath))
  fs.writeFileSync(filePath, data)
  return createdDirPath
}

export function tmp(filePath) {
  return path.join(tempDir, filePath)
}
