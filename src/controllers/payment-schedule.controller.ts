import { AppDataSource } from '../config/database.config'
import { PaymentSchedule } from '../entities/loan/paymentSchedule.entity'
import { handleError, handleSuccess } from './types'

export async function updatePaymentSchedule(newPaymentSchedule: PaymentSchedule) {
  const dataSource = AppDataSource.getRepository(PaymentSchedule)
  try {
    const entity = dataSource.create(newPaymentSchedule)
    const newEntity = await dataSource.save(entity)
    return handleSuccess(newEntity)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al actualizar el plan de pagos')
  }
}
