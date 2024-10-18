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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_penalty_amount: number

  @Column({ type: 'varchar', length: 50 })
  status: string

  @ManyToOne(() => Loan, (loan) => loan.penalty_plans)
  loan: Loan

  @OneToMany(
    () => PenaltyPaymentSchedule,
    (penaltyPaymentSchedule) => penaltyPaymentSchedule.penalty_plan,
    { cascade: true }
  )
  penalty_payment_schedules: PenaltyPaymentSchedule[]
}
