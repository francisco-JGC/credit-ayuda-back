import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Client } from '../client/client.entity'
import { PenaltyPlan } from '../penalty/penaltyPlan.entity'
import { PaymentPlan } from './paymentPlan.entity'

@Entity('loan')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'decimal', scale: 2 })
  amount: number

  @Column({ type: 'date' })
  loan_date: Date

  @Column({ type: 'decimal', scale: 2 })
  interest_rate: number

  @Column({ type: 'decimal', scale: 2 })
  total_recovered: number

  @Column({ type: 'decimal', scale: 2, default: 0 })
  total_pending: number

  @Column({ type: 'varchar', length: 50 })
  status: 'active' | 'paid' | 'pending' | 'rejected'

  @OneToOne(() => PaymentPlan, { cascade: true })
  @JoinColumn()
  payment_plan: PaymentPlan

  @OneToOne(() => PenaltyPlan, (plan) => plan.loan, {
    cascade: true
  })
  penalty_plan: PenaltyPlan

  @ManyToOne(() => Client, (client) => client.loans, { eager: true, onDelete: 'CASCADE' })
  client: Client

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
