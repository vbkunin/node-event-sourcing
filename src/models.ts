
export interface PurchaseCreateBody {
  amount: number,
  payer: string,
  debtors: string[]
  title?: string,
  date?: Date | string,
}

export interface PurchaseCreateEventData {
  title: string,
  amount: number,
  payer: string,
  debtors: string[]
  date: Date | string,
}

export interface PurchaseUpdateBody {
  title?: string,
  date?: Date | string,
}

export interface PurchaseUpdateEventData {
  id: string,
  title?: string,
  date?: Date | string,
}

export interface DebtsBody {
  debts: string[]
}

export interface ErrorResponseBody {
  message: string,
  errors?: Array<any>
}