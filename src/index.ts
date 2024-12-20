import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import { AppDataSource } from './config/database.config'
import { createDefaultRoles } from './controllers/initializers/role.initializer'

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
