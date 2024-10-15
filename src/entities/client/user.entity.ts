import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm'

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

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
