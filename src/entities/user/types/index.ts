import type { Role } from '../../role/role.entity'

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

export interface IUpdateUser {
  id: number
  username: string
  password?: string
  role_name: string
}
