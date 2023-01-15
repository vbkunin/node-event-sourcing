import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { pool } from './modules/pg/index.js'
import { PurchaseRepository, DebtRepository } from './modules/repository/index.js'
import { getRoutes } from './router.js'

dotenv.config()

const app = express()
app.use(cors({
  "origin": "*",
  "methods": "GET"
}))
app.use('/v1/', getRoutes(new PurchaseRepository(pool), new DebtRepository(pool)))

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Buns With Raisins – Query API is listening on port ${port}`)
})