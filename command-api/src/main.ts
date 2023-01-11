import dotenv from 'dotenv'
import express from 'express'
import { router } from './router.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use('/v1', router)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Buns With Raisins – Command API is listening on port ${port}`)
})