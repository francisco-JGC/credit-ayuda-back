import { AppDataSource } from '../config/database.config'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  type IHandleResponseController
} from './types'
import { ICreateClient } from '../entities/client/types'
import { Client } from '../entities/client/client.entity'
import { getRouteByName } from './route.controller'
import { Route } from '../entities/route/route.entity'

export const createClient = async (
  client: ICreateClient
): Promise<IHandleResponseController<Client>> => {
  try {
    const clientRepo = AppDataSource.getRepository(Client)

    const clientExist = await clientRepo.findOne({
      where: { dni: client.dni },
      relations: ['route']
    })

    if (clientExist) {
      return handleNotFound('Ya existe un cliente con esta identificación')
    }

    const newClient = clientRepo.create({
      ...client
    })

    const { data: route } = (await getRouteByName(client.route_name)) as {
      data: Route
    }

    if (!route) {
      return handleNotFound(
        'Ruta no encontrada, porfavor ingrese el nombre de ruta valido'
      )
    }

    newClient.route = route

    await clientRepo.save(newClient)

    return handleSuccess(newClient)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getClientById = async (
  id: number
): Promise<IHandleResponseController<Client>> => {
  try {
    const client = await AppDataSource.getRepository(Client).findOne({
      where: { id },
      relations: ['route']
    })

    if (!client) {
      return handleNotFound('Usuario no encontrado')
    }

    return handleSuccess(client)
  } catch (error: any) {
    return handleError(error.message)
  }
}
