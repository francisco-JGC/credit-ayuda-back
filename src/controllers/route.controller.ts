import { AppDataSource } from '../config/database.config'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IPagination,
  IPaginationResponse,
  type IHandleResponseController
} from './types'
import { Route } from '../entities/route/route.entity'
import { ICreateRoute } from '../entities/route/types'
import { ILike } from 'typeorm'
import { Client } from '../entities/client/client.entity'

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

export const getAllRoutes = async (): Promise<
  IHandleResponseController<Route[]>
> => {
  try {
    const routes = await AppDataSource.getRepository(Route).find()

    return handleSuccess(routes)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getPaginationRoutes = async ({
  filter,
  page,
  limit
}: IPagination): Promise<
  IHandleResponseController<IPaginationResponse<Route[]>>
> => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Numero de pagina o limite son valores invalidos')
    }

    const routes = await AppDataSource.getRepository(Route).find({
      where: { name: ILike(`%${filter || ''}%`) },
      // skip: (page - 1) * limit,
      // take: limit,
      order: { created_at: 'DESC' }
    })

    const total_data = (await AppDataSource.getRepository(Route).find()).length

    return handleSuccess({
      data: routes,
      total_data,
      total_page: Math.ceil(total_data / limit),
      page,
      limit
    })
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getRouteById = async (
  id: number
): Promise<IHandleResponseController<Route>> => {
  try {
    const route = await AppDataSource.getRepository(Route).findOne({
      where: { id }
    })

    if (!route) {
      return handleNotFound('Ruta no encontrada')
    }

    return handleSuccess(route)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const updateRouteById = async (
  route_info: Route
): Promise<IHandleResponseController<Route>> => {
  try {
    const route = await AppDataSource.getRepository(Route).findOne({
      where: { id: route_info.id }
    })

    if (!route) {
      return handleNotFound('Ruta no encontrada')
    }

    const updatedRoute = AppDataSource.getRepository(Route).merge(
      route,
      route_info
    )

    await AppDataSource.transaction(async (manager) => {
      await manager.save(updatedRoute)
    })

    return handleSuccess(updatedRoute)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const deleteRouteById = async (
  id: number
): Promise<IHandleResponseController<Route>> => {
  try {
    const routeRepo = AppDataSource.getRepository(Route)

    const routeToDelete = await routeRepo.findOne({ where: { id } })

    if (!routeToDelete) {
      return handleError('Ruta no encontrada')
    }
    await AppDataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(Client)
        .set({ route: null })
        .where('id = :id', { id })
        .execute()

      await manager
        .createQueryBuilder()
        .delete()
        .from(Route)
        .where('id = :id', { id })
        .execute()
    })

    return handleSuccess(routeToDelete)
  } catch (error: any) {
    console.error({ error })
    return handleError(error.message)
  }
}
