import { User } from '../../entities/user/user.entity'
import { AppDataSource } from '../../config/database.config'
import { getRoleByName } from '../role.controller'
import { assignRoleToUser, createUser } from '../user.controller'
import { handleError, handleSuccess } from '../types'

export const createDefaultUsers = async () => {
  try {
    const defaultUsers = [
      {
        password: '2055GGPP',
        username: 'Gutierrez',
        rolename: 'admin'
      }
    ]

    for (const user of defaultUsers) {
      const userExist = await AppDataSource.getRepository(User).findOne({
        where: { username: user.username }
      })

      if (!userExist) {
        const role = await getRoleByName(user.rolename)

        if (role.success) {
          const createdUser = await createUser({ ...user })
          if (createdUser.success) {
            await assignRoleToUser({
              userId: createdUser.data?.id || -1,
              role_name: user.rolename
            })
}
        }
      }
    }

    return handleSuccess({})
  } catch (error: any) {
    console.error({ error })
    return handleError(error.message)
  }
}
