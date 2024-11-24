export interface ICreateLoan {
  client_id: number
  amount: number
  loan_date: Date
  interest_rate: number
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'
  total_payments: number
  payment_amount: number
  total_recovered: number
}

export interface ILoanTable {
  id: number
  client_name: string
  dni: string
  amount: number
  remaining_debt: number
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'
  route: string
  status: 'active' | 'paid' | 'pending' | 'rejected'
}

export type LoanFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly'

export type LoanStatus = 'active' | 'paid' | 'pending' | 'rejected'

export interface ICredit {
  loan_id: number
  route_name: string
  collected: number
  pending_collected: number
  paid_installments: number
  pending_installments: number
}
