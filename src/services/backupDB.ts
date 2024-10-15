import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import os from 'os'

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT

export const backupDatabase = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const downloadDir = path.join(os.homedir(), 'Downloads')
    const backupDir = path.join(downloadDir, 'backup')

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    const backupFile = path.join(backupDir, `backup-${Date.now()}.sql`)

    process.env.PGPASSWORD = DB_PASS

    const dumpCommand = `pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -F c -b -v -f "${backupFile}" ${DB_NAME}`

    exec(dumpCommand, (error, _stdout, stderr) => {
      if (error) {
        console.error(`Error realizando el backup: ${error.message}`)
        console.error(`stderr: ${stderr}`)
        return resolve(false)
      }
      console.log(`Backup realizado con éxito en: ${backupFile}`)
      return resolve(true)
    })
  })
}
