import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation
} from 'typeorm'
import { Register } from '../register/register.entity'
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

  @ManyToOne(() => Route, (route) => route.user, { onDelete: 'SET NULL' })
  @JoinColumn()
  route?: Route

  @OneToMany(() => Register, (register) => register.user, {
    onDelete: 'SET NULL'
  })
  registers: Register[]
  @OneToMany(() => Register, (register) => register.user, {
    onDelete: 'SET NULL'
  })
  registers: Relation<Register[]>

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
