import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import { User } from '../entities/user/user.entity'
import { AppDataSource } from '../config/database.config'
import { createUser } from './user.controller'
import type {
  ICreateUser,
  ILogin,
  ILoginResponse
} from '../entities/user/types'
import { handleSuccess, type IHandleResponseController } from './types'

export const login = async ({
  username,
  password
}: ILogin): Promise<IHandleResponseController<ILoginResponse>> => {
  if (!username || !password) {
    return {
      message: 'Todos los campos son requeridos',
      success: false
    }
  }

  try {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { username },
      relations: ['roles', 'route']
    })

    if (!user) {
      return {
        message: 'Verifica tus credenciales',
        success: false
      }
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return {
        message: 'Verifica tus credenciales',
        success: false
      }
    }

    const token = sign(
      {
        id: user.id,
        role: user?.roles[0]?.name || '',
        route_name: user?.route?.name || ''
      },
      process.env.JWT_SECRET!
    )

    return handleSuccess({
      token,
      username: user.username,
      role: user?.roles[0]?.name || ''
    })
  } catch (error: any) {
    return {
      message: error.message,
      success: false
    }
  }
}

export const register = async ({
  username,
  password,
  roles,
  route
}: ICreateUser): Promise<IHandleResponseController<ILoginResponse>> => {
  const user = await createUser({ username, password, roles, route })

  if (!user.success) {
    return {
      message: user.message,
      success: false
    }
  }

  const loginResponse = await login({ username, password })

  if (!loginResponse.success) {
    return {
      message: loginResponse.message,
      success: false
    }
  }

  return {
    data: loginResponse.data,
    success: true
  }
}
