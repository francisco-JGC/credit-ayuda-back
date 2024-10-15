import { AppDataSource } from '../../config/database.config'
import { Role } from '../../entities/role/role.entity'
import { handleNotFound, handleSuccess } from '../types'
import { createDefaultUsers } from './user.initializer'

export const createDefaultRoles = async () => {
  try {
    const defaultRoles = [
      {
        name: 'admin',
        description: '',
        label: 'Administrador'
      },
      {
        name: 'collector',
        description: '',
        label: 'Cobrador'
      }
    ]

    for (const role of defaultRoles) {
      const roleExists = await AppDataSource.getRepository(Role).findOne({
        where: { name: role.name }
      })

      if (!roleExists) {
        await AppDataSource.getRepository(Role).save(role)
      }
    }

    await createDefaultUsers()
    return handleSuccess('Initializer')
  } catch (error: any) {
    console.error({ error })
    return handleNotFound(error.message)
  }
}
