import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Loan } from '../loan/loan.entity'
import { PenaltyPaymentSchedule } from './penaltySchedule.entity'

@Entity('penalty_plan')
export class PenaltyPlan {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'decimal' })
  total_penalty_amount: number

  @Column({ type: 'decimal', nullable: true })
  current_penalty_amount: number

  @Column({ type: 'decimal' })
  interest_rate: number

  @Column({ type: 'varchar', length: 50 })
  status: 'paid' | 'pending' | 'unpaid'

  @OneToOne(() => Loan, (loan) => loan.penalty_plan, { onDelete: 'CASCADE' })
  @JoinColumn()
  loan: Loan

  @OneToMany(
    () => PenaltyPaymentSchedule,
    (penaltyPaymentSchedule) => penaltyPaymentSchedule.penalty_plan,
    { onDelete: 'CASCADE' }
  )
  penalty_payment_schedules: PenaltyPaymentSchedule[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
