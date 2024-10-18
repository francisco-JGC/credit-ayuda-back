import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { PaymentPlan } from './paymentPlan.entity'

@Entity('payment_schedule')
export class PaymentSchedule {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'date' })
  due_date: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_due: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount_paid: number

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string

  @ManyToOne(() => PaymentPlan, (paymentPlan) => paymentPlan.payment_schedules)
  payment_plan: PaymentPlan
}
