export enum EventType {
  bwr_purchase_created = 'bwr.purchase.created',
  bwr_purchase_updated = 'bwr.purchase.updated',
  bwr_debts_paid = 'bwr.debts.paid',
  bwr_debts_accepted = 'bwr.debts.accepted'
}

export interface EventData {}

export interface PurchaseCreateEventData extends EventData{
  title: string,
  amount: number,
  payer: string,
  debtors: string[]
  date: Date | string,
}

export interface PurchaseUpdateEventData extends EventData{
  id: string,
  title?: string,
  date?: Date | string,
}