import { User } from '../../entities/user/user.entity'
import { AppDataSource } from '../../config/database.config'
import { getRoleByName } from '../role.controller'
import { assignRoleToUser, createUser } from '../user.controller'
import { handleError, handleSuccess } from '../types/types'
import { ICreateUser } from '../../entities/user/types/types'
import { Role } from '../../entities/role/role.entity'

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
        const roleResponse = await getRoleByName(user.rolename)

        if (roleResponse.success) {
          const role = roleResponse.data as Role
          const newUser: ICreateUser = {
            password: user.password,
            username: user.username,
            roles: [role]
          }
          const createdUser = await createUser(newUser)
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
