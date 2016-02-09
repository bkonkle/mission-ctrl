import {sync as mkdirp} from 'mkdirp'
import {sync as rimraf} from 'rimraf'
import {tmpdir} from 'os'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'

export const tempDir = path.join(tmpdir(), `ship-yard-${uuid.v4()}`)
process.on('exit', () => rimraf(tempDir))

export function outputToTempDir(filePath, data) {
  const createdDirPath = mkdirp(path.join(tempDir, path.dirname(filePath)))
  fs.writeFileSync(path.join(tempDir, filePath), data)
  return createdDirPath
}
