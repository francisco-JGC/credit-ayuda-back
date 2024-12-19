import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { PaymentPlan } from './paymentPlan.entity'

@Entity('payment_schedule')
export class PaymentSchedule {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'date' })
  due_date: Date

  @Column({ type: 'timestamp', nullable: true })
  paid_date: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_due: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount_paid: number

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'paid' | 'late'

  @ManyToOne(() => PaymentPlan, (paymentPlan) => paymentPlan.payment_schedules)
  payment_plan: Relation<PaymentPlan>
}
