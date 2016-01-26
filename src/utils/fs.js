import MemoryFS from 'memory-fs'
import path from 'path'

export const memfs = new MemoryFS()

export function outputToMemFs(filePath, data) {
  const createdDirPath = memfs.mkdirpSync(path.dirname(filePath))
  memfs.writeFileSync(filePath, data)
  return createdDirPath
}
