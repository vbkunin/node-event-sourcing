import { pool } from './modules/pg/index.js'
import { Repository, PurchaseRepository, PurchaseCondition, DebtRepository, DebtCondition } from './modules/repository/index.js'
import { Debt, Purchase } from './modules/repository/models.js'

console.log('Buns With Raisins – Query API')

const purchaseRepo: Repository<Purchase, PurchaseCondition> = new PurchaseRepository(pool)
const debtRepo: Repository<Debt, DebtCondition> = new DebtRepository(pool)

debtRepo.find({ creditorUsername: 'vladimir', accepted: false }).then(console.log)

purchaseRepo.find({ payerUsername: 'vladimir' }).then(console.log)

purchaseRepo.getById("ce6331ff-004f-4d63-9c4d-d9e8e6e8d542").then(console.log)