export interface User {
  id: string,
  username: string
}

export interface Purchase {
  id?: string,
  title: string,
  date: Date,
  amount: number,
  payer: User
}

export interface Debt {
  id?: string,
  purchaseId: string,
  purchaseTitle: string,
  purchaseDate: Date,
  creditor: User,
  debtor: User,
  amount: number,
  remains: number,
  accepted: boolean
}