import { AppDataSource } from '../config/database.config'
import { Role } from '../entities/role/role.entity'
import { IRoleResponse } from '../entities/role/types'
import { handleError, handleSuccess, IHandleResponseController } from './types'

export const getRoleByName = async (
  role_name: string
): Promise<IHandleResponseController<IRoleResponse>> => {
  try {
    const role = await AppDataSource.getRepository(Role).findOne({
      where: { name: role_name }
    })

    if (!role) {
      return {
        success: false,
        message: 'No se ha encontrado ningun rol con ese nombre'
      }
    }

    return {
      success: true,
      data: role
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
}

export const getAllRoles = async (): Promise<
  IHandleResponseController<Role[]>
> => {
  try {
    const roles = await AppDataSource.getRepository(Role).find()

    return handleSuccess(roles)
  } catch (error: any) {
    return handleError(error.message)
  }
}
