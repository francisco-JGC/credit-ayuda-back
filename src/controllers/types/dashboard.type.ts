export interface IGetMonthlySalesInformation {
  total_cash: number
  cash_percentage: number
  total_product: number
  total_sales: number
  sales_percentage: number
  total_inventory_value: number
}

export interface IGetSalesLastSixMonths {
  month: string
  totalSales: number
  totalRevenue: number
  startDate: string
  endDate: string
}
