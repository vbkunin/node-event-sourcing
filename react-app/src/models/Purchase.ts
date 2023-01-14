import User from './User'

export default interface Purchase {
  id: string
  title: string
  date: Date|string
  amount: number
  payer: User
}