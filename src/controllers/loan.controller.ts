import { EntityManager } from 'typeorm'
import { AppDataSource } from '../config/database.config'
import { Client } from '../entities/client/client.entity'
import { Loan } from '../entities/loan/loan.entity'
import { PaymentPlan } from '../entities/loan/paymentPlan.entity'
import { PaymentSchedule } from '../entities/loan/paymentSchedule.entity'
import { ICreateLoan } from '../entities/loan/types/loan'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  type IHandleResponseController
} from './types'

export const createLoan = async (
  loan_info: ICreateLoan
): Promise<IHandleResponseController<Loan>> => {
  try {
    const clientRepo = AppDataSource.getRepository(Client)
    const loanRepo = AppDataSource.getRepository(Loan)
    const paymentPlanRepo = AppDataSource.getRepository(PaymentPlan)

    const client = await clientRepo.findOne({
      where: { id: loan_info.client_id },
      relations: ['loans']
    })

    if (!client) {
      return handleNotFound('El cliente asignado al prestamos no existe')
    }

    const newPaymentPlan = paymentPlanRepo.create({
      total_payments: Number(loan_info.total_payments),
      payments_remaining: Number(loan_info.total_payments),
      frequency: loan_info.frequency,
      payment_amount: loan_info.payment_amount
    })

    const createdPaymentPlan = await paymentPlanRepo.save(newPaymentPlan)

    const newLoan = loanRepo.create({
      amount: Number(loan_info.amount),
      loan_date: loan_info.loan_date,
      interest_rate: Number(loan_info.interest_rate),
      status: 'pending',
      total_recovered: loan_info.total_recovered,
      total_pending: 0
    })

    const createdLoan = await loanRepo.save(newLoan)

    await AppDataSource.transaction(async (manager: EntityManager) => {
      if (!client.loans) {
        client.loans = []
      }

      createdLoan.payment_plan = createdPaymentPlan
      client.loans.push(createdLoan)

      await manager.save(createdLoan)
      await manager.save(client)
    })

    await createPaymentSchedule(client.id, createdLoan.id)

    return handleSuccess(createdLoan)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const createPaymentSchedule = async (
  clientId: number,
  loanId: number
): Promise<IHandleResponseController<PaymentPlan>> => {
  try {
    const clientRepo = AppDataSource.getRepository(Client)

    const client = await clientRepo.findOne({
      where: { id: clientId },
      relations: [
        'loans',
        'loans.payment_plan',
        'loans.payment_plan.payment_schedules'
      ]
    })

    if (!client) {
      return handleNotFound('Cliente no encontrado')
    }
    const loan = client.loans.find((loan) => loan.id === loanId)

    if (!loan) {
      return handleNotFound('Prestamo no encontrado')
    }

    const { payment_plan: paymentPlan } = loan
    const loan_date = loan.loan_date
    const schedules: PaymentSchedule[] = []

    const total_recovered = loan.total_recovered
    const total_payments = paymentPlan.total_payments
    const frequency = paymentPlan.frequency

    const amount_due_per_term = Math.floor(total_recovered / total_payments)
    const totalCalculated = amount_due_per_term * total_payments
    const remainder = total_recovered - totalCalculated

    const addDaysSkippingWeekends = (date: Date, days: number): Date => {
      let newDate = new Date(date)
      let addedDays = 0

      while (addedDays < days) {
        newDate.setDate(newDate.getDate() + 1)
        if (!isWeekend(newDate)) {
          addedDays++
        }
      }
      return newDate
    }

    const addMonthsSkippingWeekends = (date: Date, months: number): Date => {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() + months)

      while (isWeekend(newDate)) {
        newDate.setDate(newDate.getDate() + 1)
      }
      return newDate
    }

    const isWeekend = (date: Date): boolean => {
      const day = date.getDay()
      return day === 6 || day === 0
    }

    for (let i = 1; i < total_payments; i++) {
      let nextDueDate: Date

      switch (frequency) {
        case 'daily':
          nextDueDate = addDaysSkippingWeekends(new Date(loan_date), i)
          break
        case 'weekly':
          nextDueDate = addDaysSkippingWeekends(new Date(loan_date), i * 7)
          break
        case 'biweekly':
          nextDueDate = addDaysSkippingWeekends(new Date(loan_date), i * 14)
          break
        case 'monthly':
          nextDueDate = addMonthsSkippingWeekends(new Date(loan_date), i)
          break
        case 'yearly':
          nextDueDate = addMonthsSkippingWeekends(new Date(loan_date), i * 12)
          break
        default:
          return handleNotFound('Frecuencia no válida')
      }

      const paymentSchedule = new PaymentSchedule()
      paymentSchedule.due_date = nextDueDate
      paymentSchedule.amount_due =
        i === total_payments - 1
          ? amount_due_per_term + remainder
          : amount_due_per_term
      paymentSchedule.amount_paid = 0
      paymentSchedule.status = 'pending'
      paymentSchedule.payment_plan = paymentPlan

      schedules.push(paymentSchedule)
    }

    paymentPlan.payment_schedules = schedules
    paymentPlan.payment_amount = schedules[0].amount_due

    await AppDataSource.transaction(async (manager: EntityManager) => {
      await manager.save(paymentPlan)
    })

    return handleSuccess(paymentPlan)
  } catch (error) {
    console.error('Error al crear el plan de pago:', error)
    return handleError('No se pudo crear el plan de pago')
  }
}
