import { PaymentSchedule } from '../paymentSchedule.entity'

export interface IUpdatePayment extends PaymentSchedule {
  loan_id: number
}
