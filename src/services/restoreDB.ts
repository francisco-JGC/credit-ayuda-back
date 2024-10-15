import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import os from 'os'

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS // Contraseña
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT

export const restoreDatabase = (fileName: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const downloadDir = path.join(os.homedir(), 'Downloads/backup')
    const filePath = path.join(downloadDir, fileName)

    if (!fs.existsSync(filePath)) {
      console.error(`El archivo de restauración no existe: ${filePath}`)
      return resolve(false)
    }

    process.env.PGPASSWORD = DB_PASS

    const dropDBCommand = `dropdb --force  -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME}`

    exec(dropDBCommand, (dropError, _stdout, stderr) => {
      if (dropError) {
        if (stderr.includes(`database "${DB_NAME}" does not exist`)) {
          console.log(
            `La base de datos "${DB_NAME}" no existe, creando una nueva.`
          )
        } else {
          console.error(
            `Error al eliminar la base de datos: ${dropError.message}`
          )
          console.error(`stderr: ${stderr}`)
          return resolve(false)
        }
      }

      const createDBCommand = `createdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME}`

      exec(createDBCommand, (createError) => {
        if (createError) {
          console.error(
            `Error al crear la base de datos: ${createError.message}`
          )
          return resolve(false)
        }
        console.log(`Base de datos "${DB_NAME}" creada con éxito.`)

        const restoreCommand = `pg_restore -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -v "${filePath}"`

        exec(restoreCommand, (restoreError, _stdout, stderr) => {
          if (restoreError) {
            console.error(
              `Error restaurando la base de datos: ${restoreError.message}`
            )
            console.error(`stderr: ${stderr}`)
            return resolve(false)
          }
          console.log(`Base de datos restaurada con éxito desde: ${filePath}`)
          return resolve(true)
        })
      })
    })
  })
}
