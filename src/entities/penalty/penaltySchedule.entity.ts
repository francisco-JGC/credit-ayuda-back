import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { PenaltyPlan } from './penaltyPlan.entity'

@Entity()
export class PenaltyPaymentSchedule {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'date' })
  dueDate: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_due: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount_paid: number

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'unpaid' | 'paid' | 'pending'

  @ManyToOne(
    () => PenaltyPlan,
    (penaltyPlan) => penaltyPlan.penalty_payment_schedules
  )
  penalty_plan: PenaltyPlan
}
