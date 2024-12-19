import { AppDataSource } from '../config/database.config'
import { PenaltyPlan } from '../entities/penalty/penaltyPlan.entity'
import { PenaltyPaymentSchedule } from '../entities/penalty/penaltySchedule.entity'
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

export async function getPenaltyPlan(id: number) {
  try {
    const penaltyPlan = await AppDataSource.getRepository(PenaltyPlan).findOne({
      where: { id },
      relations: {
        loan: true,
        penalty_payment_schedules: true
      }
    })

    if (!penaltyPlan) {
      return handleError('Plan de penalización no encontrado')
    }

    return handleSuccess(penaltyPlan)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al obtener el plan de penalización')
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

export async function addPenaltyPayment(
  id: number,
  penaltyPayment: PenaltyPaymentSchedule
) {
  try {
    const penaltyPlan = await AppDataSource.getRepository(PenaltyPlan).findOne({
      where: { id },
      relations: {
        penalty_payment_schedules: true
      }
    })

    if (!penaltyPlan) {
      return handleError('Plan de penalización no encontrado')
    }

    penaltyPlan.current_penalty_amount -= penaltyPayment.amount_paid
    if (penaltyPlan.current_penalty_amount === 0) {
      penaltyPlan.status = 'paid'
    }
    penaltyPlan.penalty_payment_schedules.push(penaltyPayment)
    await AppDataSource.getRepository(PenaltyPlan).save(penaltyPlan)

    return handleSuccess(penaltyPayment)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al añadir el pago')
  }
}
