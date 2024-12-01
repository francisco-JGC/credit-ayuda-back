import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { Loan } from '../loan/loan.entity'
import { PenaltyPaymentSchedule } from './penaltySchedule.entity'

@Entity('penalty_plan')
export class PenaltyPlan {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'decimal' })
  total_penalty_amount: number

  @Column({ type: 'decimal' })
  interest_rate: number

  @Column({ type: 'varchar', length: 50 })
  status: 'paid' | 'pending' | 'unpaid'

  @ManyToOne(() => Loan, (loan) => loan.penalty_plans)
  loan: Loan

  @OneToMany(
    () => PenaltyPaymentSchedule,
    (penaltyPaymentSchedule) => penaltyPaymentSchedule.penalty_plan,
    { cascade: true }
  )
  penalty_payment_schedules: PenaltyPaymentSchedule[]
}
