import { AppDataSource } from '../config/database.config'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IPagination,
  IPaginationResponse,
  type IHandleResponseController
} from './types'
import { IClientTable, ICreateClient } from '../entities/client/types'
import { Client } from '../entities/client/client.entity'
import { getRouteByName } from './route.controller'
import { Route } from '../entities/route/route.entity'
import { ILike } from 'typeorm'

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
): Promise<IHandleResponseController<ICreateClient>> => {
  try {
    const client = await AppDataSource.getRepository(Client).findOne({
      where: { id },
      relations: ['route']
    })

    if (!client) {
      return handleNotFound('Cliente no encontrado')
    }

    return handleSuccess({ ...client, route_name: client.route?.name || '' })
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const deleteClientById = async (
  id: number
): Promise<IHandleResponseController<Client>> => {
  try {
    const client = await AppDataSource.getRepository(Client).findOne({
      where: { id }
    })

    if (!client) {
      return handleNotFound('Proveedor no encontrado')
    }

    return handleSuccess(
      await AppDataSource.getRepository(Client).remove(client)
    )
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const updateClientById = async (
  client: ICreateClient,
  id: number
): Promise<IHandleResponseController<Client>> => {
  try {
    const clientExist = await AppDataSource.getRepository(Client).findOne({
      where: { id },
      relations: ['route']
    })

    if (!clientExist) {
      return handleNotFound('Cliente no encontrado')
    }

    AppDataSource.getRepository(Client).merge(clientExist, client)
    const updatedUser =
      await AppDataSource.getRepository(Client).save(clientExist)

    await assignRouteToClient({ client_id: id, route_name: client.route_name })

    return handleSuccess(updatedUser)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const assignRouteToClient = async ({
  client_id,
  route_name
}: {
  client_id: number
  route_name: string
}): Promise<IHandleResponseController<Client>> => {
  try {
    const client = await AppDataSource.getRepository(Client).findOne({
      where: { id: client_id },
      relations: ['route']
    })

    if (!client) {
      return handleNotFound('Cliente no encontrado')
    }

    if (client?.route?.name === route_name) {
      return handleSuccess(client)
    }

    const { data: route, success } = await getRouteByName(route_name)

    if (!success) {
      return handleNotFound('No se encontro una ruta con ese nombre')
    }

    client.route = route

    await AppDataSource.getRepository(Client).save(client)

    return handleSuccess(client)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getPaginationClient = async ({
  filter,
  page,
  limit
}: IPagination): Promise<
  IHandleResponseController<IPaginationResponse<IClientTable[]>>
> => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Numero de pagina o limite son valores invalidos')
    }

    const clients = await AppDataSource.getRepository(Client).find({
      where: { dni: ILike(`%${filter || ''}%`) },
      relations: [
        'route',
        'loans',
        'loans.payment_plan',
        'loans.payment_plan.payment_schedules',
        'loans.penalty_plans',
        'loans.penalty_plans.penalty_payment_schedules'
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    })

    const clientTables: IClientTable[] = clients.map((client) => {
      return {
        id: client.id,
        name: client.name,
        phone: client.primary_phone,
        dni: client.dni,
        address: client.primary_address,
        current_debt:
          client?.loans?.[client?.loans?.length - 1]?.total_pending || 0,
        route: client?.route?.name || '',
        loan_status: client?.loans?.[0]?.status || ''
      }
    })

    const total_data = (await AppDataSource.getRepository(Client).find()).length

    return handleSuccess({
      data: clientTables,
      total_data,
      total_page: Math.ceil(total_data / limit),
      page,
      limit
    })
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getClientByDni = async (
  dni: string
): Promise<IHandleResponseController<ICreateClient>> => {
  try {
    const client = await AppDataSource.getRepository(Client).findOne({
      where: { dni },
      relations: ['route']
    })

    if (!client) {
      return handleNotFound('Cliente no encontrado')
    }

    return handleSuccess({ ...client, route_name: client?.route?.name || '' })
  } catch (error: any) {
    return handleError(error.message)
  }
}
