import { EntityManager, In, Like } from 'typeorm'
import { AppDataSource } from '../config/database.config'
import { Client } from '../entities/client/client.entity'
import { Loan } from '../entities/loan/loan.entity'
import { PaymentPlan } from '../entities/loan/paymentPlan.entity'
import { PaymentSchedule } from '../entities/loan/paymentSchedule.entity'
import {
  ICreateLoan,
  ILoanTable,
  LoanFrequency,
  LoanStatus
} from '../entities/loan/types/loan'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IPagination,
  IPaginationResponse,
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

export const updateLoan = async (loan: Loan) => {
  try {
    const loanRepo = AppDataSource.getRepository(Loan)

    const loanExist = await loanRepo.findOne({
      where: { id: loan.id }
    })

    if (!loanExist) {
      return handleError('El prestamo no existe')
    }

    const updatedLoan = await loanRepo.save({
      ...loan,
      total_pending: loanExist.total_recovered
    })
    return handleSuccess(updatedLoan)
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
      const newDate = new Date(date)
      let addedDays = 0

      while (addedDays < days) {
        newDate.setDate(newDate.getDate() + 1)
        if (!isWeekend(newDate)) {
          addedDays++
        }
      }
      return newDate
    }

    const addMonths = (date: Date, months: number): Date => {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() + months)
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
          nextDueDate = new Date(loan_date)
          nextDueDate.setDate(nextDueDate.getDate() + i * 7)
          break
        case 'biweekly':
          nextDueDate = new Date(loan_date)
          nextDueDate.setDate(nextDueDate.getDate() + i * 14)
          break
        case 'monthly':
          nextDueDate = addMonths(new Date(loan_date), i)
          break
        case 'yearly':
          nextDueDate = addMonths(new Date(loan_date), i * 12)
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

interface IGetLoan {
  page: number
  limit: number
  dni?: string
  frequency?: LoanFrequency
  status?: LoanStatus
  route?: string
  statuses?: LoanStatus[]
  route_name?: string
}

export const getLoans = async ({
  page,
  limit,
  frequency,
  status,
  route,
  dni
}: IGetLoan) => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Número de página o límite son valores inválidos')
    }

    const defaultStatus = ['active', 'paid', 'rejected']

    const loansRepository = AppDataSource.getRepository(Loan)
    const [loans, loansCount] = await loansRepository.findAndCount({
      relations: { client: { route: true }, payment_plan: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      where: {
        client: {
          name: Like(`%${dni ?? ''}%`),
          route: {
            name: route
          }
        },
        payment_plan: {
          frequency
        },
        status: status || In(defaultStatus)
      }
    })

    return handleSuccess({
      data: loans,
      total_data: loansCount,
      total_page: Math.ceil(loansCount / limit),
      page,
      limit
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error desconocido')
  }
}

export const getLoansByRouteUser = async ({
  route_name,
  page,
  limit,
  frequency,
  status,
  route,
  dni
}: IGetLoan) => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Número de página o límite son valores inválidos')
    }

    const defaultStatus = ['active', 'paid', 'rejected']

    console.log({ dni })
    const loansRepository = AppDataSource.getRepository(Loan)
    const [loans] = await loansRepository.findAndCount({
      relations: { client: { route: true }, payment_plan: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      where: {
        client: {
          name: Like(`%${dni ?? ''}%`),
          route: {
            name: route
          }
        },
        payment_plan: {
          frequency
        },
        status: status || In(defaultStatus)
      }
    })

    const filteredLoans = loans.filter(
      (loan) => loan.client.route?.name === route_name
    )

    return handleSuccess({
      data: filteredLoans,
      total_data: filteredLoans.length,
      total_page: Math.ceil(filteredLoans.length / limit),
      page,
      limit
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error desconocido')
  }
}

export const getRequests = async ({
  page,
  limit,
  frequency,
  route,
  dni
}: IGetLoan) => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Número de página o límite son valores inválidos')
    }
    const loansRepository = AppDataSource.getRepository(Loan)
    const [loans, loansCount] = await loansRepository.findAndCount({
      relations: { client: { route: true }, payment_plan: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      where: {
        client: {
          dni: Like(`%${dni ?? ''}%`),
          route: {
            name: route
          }
        },
        payment_plan: {
          frequency
        },
        status: 'pending'
      }
    })

    return handleSuccess({
      data: loans,
      total_data: loansCount,
      total_page: Math.ceil(loansCount / limit),
      page,
      limit
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
    return handleError('Error desconocido')
  }
}

export const getPaginationLoans = async ({
  filter,
  page,
  limit
}: IPagination): Promise<
  IHandleResponseController<IPaginationResponse<ILoanTable[]>>
> => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Número de página o límite son valores inválidos')
    }

    const clientRepository = AppDataSource.getRepository(Client)

    const [clients, total_data] = await clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.route', 'route')
      .leftJoinAndSelect('client.loans', 'loans')
      .leftJoinAndSelect('loans.payment_plan', 'payment_plan')
      .leftJoinAndSelect('payment_plan.payment_schedules', 'payment_schedules')
      .leftJoinAndSelect('loans.penalty_plans', 'penalty_plans')
      .leftJoinAndSelect(
        'penalty_plans.penalty_payment_schedules',
        'penalty_payment_schedules'
      )
      .where('client.dni ILIKE :filter', {
        filter: `%${filter ?? ''}%`
      })
      .andWhere('loans.id IS NOT NULL')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('client.created_at', 'DESC')
      .getManyAndCount()

    const loansTable: ILoanTable[] = clients.map((client) => {
      const loan = client.loans[client.loans.length - 1]

      return {
        id: loan?.id || -1,
        client_name: client.name,
        amount: loan?.amount || 0,
        dni: client.dni,
        remaining_debt: loan?.total_pending || 0,
        frequency: loan?.payment_plan?.frequency || '',
        route: client?.route?.name || '',
        status: loan?.status || ''
      }
    })

    return handleSuccess({
      data: loansTable,
      total_data,
      total_page: Math.ceil(total_data / limit),
      page,
      limit
    })
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getLoanById = async (
  id: number
): Promise<IHandleResponseController<Loan>> => {
  try {
    const loanRepo = AppDataSource.getRepository(Loan)

    const loan = await loanRepo.findOne({
      where: { id },
      relations: [
        'client',
        'client.route',
        'payment_plan',
        'payment_plan.payment_schedules',
        'penalty_plans',
        'penalty_plans.penalty_payment_schedules'
      ]
    })

    if (!loan) {
      return handleNotFound('El id del prestamo no existe')
    }

    return handleSuccess(loan)
  } catch (error: any) {
    return handleError(error.message)
  }
}
