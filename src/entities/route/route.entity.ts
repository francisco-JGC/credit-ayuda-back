import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Client } from '../client/client.entity'

@Entity('route')
export class Route {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  description?: string

  @OneToMany(() => Client, (client) => client.route)
  client?: Client[]

  @OneToMany(() => Client, (client) => client.route)
  user?: Client[]

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
