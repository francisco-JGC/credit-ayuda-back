import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity('register')
export class Register {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: ['income', 'withdraw', 'loan', 'savings', 'cash', 'expenses'],
    default: 'income'
  })
  type: 'income' | 'withdraw' | 'loan' | 'savings' | 'cash' | 'expenses'

  @Column({ nullable: true, type: 'text' })
  details?: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cash?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  savings?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  withdraw?: number

  @ManyToOne(() => User, (user) => user.registers, { onDelete: 'SET NULL' })
  user: User

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
