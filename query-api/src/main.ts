import { pool } from './modules/pg/index.js'
import { Repository, PurchaseRepository } from './modules/repository/index.js'
import { Purchase, PurchaseCondition } from './modules/repository/models.js'

console.log('Buns With Raisins – Query API')

const repo: Repository<Purchase, PurchaseCondition> = new PurchaseRepository(pool)

repo.find({ payerUsername: 'vadim' }).then(console.log)