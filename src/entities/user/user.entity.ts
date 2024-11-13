import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Role } from '../role/role.entity'
import { Route } from '../route/route.entity'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column({ nullable: true })
  password: string

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[]

  @ManyToOne(() => Route, (route) => route.user)
  @JoinColumn()
  route?: Route

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
