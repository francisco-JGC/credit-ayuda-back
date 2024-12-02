import { AppDataSource } from '../config/database.config'
import { PenaltyPlan } from '../entities/penalty/penaltyPlan.entity'
import { handleError, handleSuccess } from './types'

export async function createPenaltyPlan(plan: PenaltyPlan) {
  try {
    const savedPlan = await AppDataSource.getRepository(PenaltyPlan).save(plan)

    return handleSuccess(savedPlan)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al crear el plan de penalización')
  }
}

export async function getPenaltyPlans() {
  try {
    const penaltyPlans = await AppDataSource.getRepository(PenaltyPlan).find()

    return handleSuccess(penaltyPlans)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al obtener los planes de penalización')
  }
}
