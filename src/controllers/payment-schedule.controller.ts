import { AppDataSource } from '../config/database.config'
import { Loan } from '../entities/loan/loan.entity'
import { PaymentSchedule } from '../entities/loan/paymentSchedule.entity'
import { IUpdatePayment } from '../entities/loan/types/payment'
import { handleError, handleSuccess } from './types'

export async function updatePaymentSchedule(
  newPaymentSchedule: IUpdatePayment
) {
  const paymentScheduleRepo = AppDataSource.getRepository(PaymentSchedule)
  const loanRepo = AppDataSource.getRepository(Loan)
  try {
    const loan = await loanRepo.findOne({
      where: { id: newPaymentSchedule.loan_id }
    })

    if (!loan) {
      return handleError('El prestamo no existe')
    }

    const entity = paymentScheduleRepo.create(newPaymentSchedule)
    const newEntity = await paymentScheduleRepo.save(entity)

    await AppDataSource.transaction(async (manager) => {
      await manager.save(loan)
    })
    return handleSuccess(newEntity)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al actualizar el plan de pagos')
  }
}

export async function getPayment(id: number) {
  const paymentScheduleRepo = AppDataSource.getRepository(PaymentSchedule)
  try {
    const payment = await paymentScheduleRepo.findOne({
      where: { id },
      relations: { payment_plan: { loan: { client: true } } }
    })

    if (!payment) {
      return handleError('El pago no existe')
    }

    return handleSuccess(payment)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error al obtener el pago')
  }
}
