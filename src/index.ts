import 'dotenv/config'

import express, { Router } from 'express'
import cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'

const app = express()
const router = Router()

app.use(
  cors({
    origin: '*'
  })
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

fs.readdirSync(path.join(__dirname, 'routes')).map(async (file) => {
  const { default: route } = await import(`./routes/${file}`)
  const [routeName] = file.split('.')
  app.use(`/api/${routeName}`, route)
})

router.get('/', function (_req, res) {
  res.send('Hellow world')
})

export default app
