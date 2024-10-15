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
