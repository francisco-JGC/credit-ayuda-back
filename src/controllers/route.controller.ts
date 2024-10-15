import { AppDataSource } from '../config/database.config'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  type IHandleResponseController
} from './types'
import { Route } from '../entities/route/route.entity'

export const createRoute = async (
  route: ICreateRoute
): Promise<IHandleResponseController<Route>> => {
  try {
    const routeRepo = AppDataSource.getRepository(Route)

    const routeExist = await routeRepo.findOne({
      where: { name: route.name }
    })

    if (routeExist) {
      return handleNotFound('Ya existe una ruta con este nombre')
    }

    const newRoute = routeRepo.create(route)

    await routeRepo.save(newRoute)

    return handleSuccess(newRoute)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getRouteByName = async (
  name: string
): Promise<IHandleResponseController<Route>> => {
  try {
    const route = await AppDataSource.getRepository(Route).findOne({
      where: { name }
    })

    if (!route) {
      return handleNotFound('Ruta no encontrada')
    }

    return handleSuccess(route)
  } catch (error: any) {
    return handleError(error.message)
  }
}
