import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { Route } from '../route/route.entity'
import { Loan } from '../loan/loan.entity'

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  dni: string

  @Column()
  primary_phone: string

  @Column({ nullable: true, default: null })
  secondary_phone?: string

  @Column()
  primary_address: string

  @Column({ nullable: true, default: null })
  secondary_address?: string

  @Column()
  business_type: string

  @ManyToOne(() => Route, (route) => route.client, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  route?: Route

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @OneToMany(() => Loan, (loan) => loan.client)
  loans: Loan[]
}
