import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne
} from 'typeorm'
import { PaymentPlan } from './paymentPlan.entity'
import { PenaltyPlan } from '../penalty/penaltyPlan.entity'
import { Client } from '../client/client.entity'

@Entity('loan')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column({ type: 'date' })
  loan_date: Date

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  interest_rate: number

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  total_recovered: number

  @Column({ type: 'varchar', length: 50 })
  status: 'active' | 'paid' | 'pending'

  @OneToOne(() => PaymentPlan, { cascade: true })
  @JoinColumn()
  payment_plan: PaymentPlan

  @OneToMany(() => PenaltyPlan, (penaltyPlan) => penaltyPlan.loan, {
    cascade: true
  })
  penalty_plans: PenaltyPlan[]

  @ManyToOne(() => Client, (client) => client.loans, { eager: true })
  client: Client
}
