import { Register } from '../register.entity'

export type CreateRegister = Omit<Register, 'id' | 'created_at' >
