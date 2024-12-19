import { CreateRegister } from '../entities/register/types'
import { AppDataSource } from '../config/database.config'
import { Register } from '../entities/register/register.entity'
import { handleError, handleSuccess } from './types'

export async function getLastRegister() {
  try {
    const register = await AppDataSource.getRepository(Register).findOne({
      order: {
        created_at: 'DESC'
      }
    })
    return handleSuccess(register)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al obtener el último registro')
  }
}

export async function getAllRegisters() {
  try {
    const registersRepository = AppDataSource.getRepository(Register)
    const registers = await registersRepository.find({
      relations: {
        user: true
      }
    })
    return handleSuccess(registers)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al obtener los registros')
  }
}

export async function createRegister(register: CreateRegister) {
  try {
    const savedRegister =
      await AppDataSource.getRepository(Register).save(register)
    return handleSuccess(savedRegister)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      return handleError(error.message)
    }
    return handleError('Error al crear el registro')
  }
}

export async function updateRegister(register: Register) {
  try {
    const updatedRegister =
      await AppDataSource.getRepository(Register).save(register)
    return handleSuccess(updatedRegister)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al actualizar el registro')
  }
}
