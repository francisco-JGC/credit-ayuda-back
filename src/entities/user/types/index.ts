import type { Role } from '../../role/role.entity'
import { User } from '../user.entity'

export interface IResponseUser {
  username: string
  id: number
  roles?: Role[]
}

export interface ICreateUser {
  username: string
  password: string
}

export interface IFindUserByUsername {
  username: string
}

export interface ILogin {
  username: string
  password: string
}

export interface ILoginResponse {
  token: string
  username: string
  role: string
}

export type IUpdateUser = Omit<User, 'created_at'>
