export interface PurchaseCreateBody {
  amount: number,
  payer: string,
  debtors: string[]
  title?: string,
  date?: string,
}

export interface PurchaseUpdateBody {
  title?: string,
  date?: string,
}

export interface DebtsBody {
  debts: string[]
}

export interface AcceptResponseBody {
  acceptedAt: string
}

export interface ErrorResponseBody {
  message: string,
  errors?: Array<any>
}