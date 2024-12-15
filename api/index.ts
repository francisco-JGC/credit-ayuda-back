import 'dotenv/config'
import { AppDataSource } from '../src/config/database.config'
import { createDefaultRoles } from '../src/controllers/initializers/role.initializer'

import app from '../src'

const port = process.env.PORT || 3001

async function main() {
  try {
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

export default app
