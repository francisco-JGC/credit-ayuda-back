export interface ICreateClient {
  name: string
  dni: string
  primary_phone: string
  secondary_phone?: string
  primary_address: string
  secondary_address?: string
  business_type: string
  route_name: string
}

export interface IClientTable {
  id: number
  name: string
  phone: string
  address: string
  current_debt: number
  route: string
  loan_status: 'active' | 'pending' | 'paid'
}
