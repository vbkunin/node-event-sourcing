export interface User {
  id: string,
  username: string
}

export interface Purchase {
  id: string,
  title: string,
  date: Date,
  amount: number,
  payer: User
}

export interface PurchaseCondition {
  id?: string,
  payerId?: string,
  payerUsername?: string,
  dateFrom?: Date,
  dateTo?: Date
}

export interface Debt {

}