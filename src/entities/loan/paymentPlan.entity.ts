import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  Relation
} from 'typeorm'
import { Loan } from './loan.entity'
import { PaymentSchedule } from './paymentSchedule.entity'

@Entity('payment_plan')
export class PaymentPlan {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  total_payments: number

  @Column({ type: 'int' })
  payments_remaining: number

  @Column({ type: 'varchar', length: 50 })
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'

  @Column({ type: 'decimal' })
  payment_amount: number

  @OneToOne(() => Loan, (loan) => loan.payment_plan)
  loan: Relation<Loan>

  @OneToMany(
    () => PaymentSchedule,
    (paymentSchedule) => paymentSchedule.payment_plan,
    { cascade: true }
  )
  payment_schedules: Relation<PaymentSchedule[]>
}
