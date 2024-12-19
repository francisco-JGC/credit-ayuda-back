import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'
import { AppDataSource } from './config/database.config'
import { createDefaultRoles } from './controllers/initializers/role.initializer'
import { fileURLToPath } from 'url'

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
  cors({
    origin: '*'
  })
)

const port = process.env.PORT || 3001

async function main() {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const routeFiles = fs.readdirSync(path.join(__dirname, 'routes'))

    for (const file of routeFiles) {
      const { default: route } = await import(`./routes/${file}`)
      const [routeName] = file.split('.')
      app.use(`/api/${routeName}`, route)
    }

    await AppDataSource.initialize()
    await runInitializers()

    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error: any) {
    console.log(error.message)
  }
}

async function runInitializers() {
  return await Promise.all([createDefaultRoles()])
}

main()
