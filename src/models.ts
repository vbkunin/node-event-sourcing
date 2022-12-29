
export interface PurchaseCreated {
  title: string,
  amount: number,
  payer: string,
  debtors: string[]
  date?: Date | string,
}

export interface PurchaseUpdateData {
  id: string,
  title: string,
  date?: Date | string,
}

export interface Debts {
  debts: string[]
}