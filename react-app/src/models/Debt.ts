import User from './User'

export default interface Debt {
  id: string
  purchaseId: string
  purchaseTitle: string
  purchaseDate: Date|string
  creditor: User
  debtor: User
  amount: number
  remains: number
  accepted: boolean
}