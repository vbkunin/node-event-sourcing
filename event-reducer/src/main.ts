import consume, { EventType, PurchaseCreateEventData } from './modules/kafka/index.js'
import { pool } from './modules/pg/index.js'
import { PurchaseRepository, DebtRepository, UserRepository } from '../../shared/repository/dist/index.js'

const userRepo = new UserRepository(pool)
const purchaseRepo = new PurchaseRepository(pool)
const debtRepo = new DebtRepository(pool)

consume(async (type, data) => {
  // console.log(type, data)
  switch (type) {
    case EventType.bwr_purchase_created:
      const purchaseCreateEventData: PurchaseCreateEventData = data as PurchaseCreateEventData
      const payer = await userRepo.getById(purchaseCreateEventData.payer)
      const purchase = await purchaseRepo.create({
        title: purchaseCreateEventData.title,
        date: new Date(purchaseCreateEventData.date),
        payer,
        amount: purchaseCreateEventData.amount,
      })
      console.log(purchase)
      break
    case EventType.bwr_purchase_updated:
      throw new Error('Event type processing not implemented yet: ' + type)
      break
    case EventType.bwr_debts_paid:
      break
    case EventType.bwr_debts_accepted:
      break
    default:
      throw new Error('Unknown event type: ' + type)
  }
})