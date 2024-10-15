import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { User } from '../user/user.entity'

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string

  @Column({ type: 'varchar', length: 25, unique: true })
  label: string

  @Column({ type: 'varchar', length: 255 })
  description: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
