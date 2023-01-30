import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { pool } from './modules/pg/index.js'
import { PurchaseRepository, DebtRepository, UserRepository } from '../../shared/repository/dist/index.js'
import { getDebtRoutes, getPurchaseRoutes, getUserRoutes } from './router.js'

dotenv.config()

const app = express()
app.use(cors({
  "origin": "*",
  "methods": "GET"
}))
app.use('/v1/', getPurchaseRoutes(new PurchaseRepository(pool)))
app.use('/v1/', getDebtRoutes(new DebtRepository(pool)))
app.use('/v1/', getUserRoutes(new UserRepository(pool)))

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Buns With Raisins – Query API is listening on port ${port}`)
})