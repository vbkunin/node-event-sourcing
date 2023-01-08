import { NextFunction, Request, Response, Router } from 'express'
import { Path } from './path.js'
import { AcceptResponseBody, DebtsBody, ErrorResponseBody, PurchaseCreateBody, PurchaseUpdateBody } from './models.js'
import { validate, ValidationError } from './modules/schemavalidator/index.js'
import { produce } from './modules/kafka/index.js'
import { EventType, PurchaseCreateEventData, PurchaseUpdateEventData } from './modules/kafka/models.js'
import { ErrorRequestHandler } from 'express-serve-static-core'

const router = Router()

router.post(Path.v1_purchase_create, async (req: Request<any, any, PurchaseCreateBody>, res: Response<AcceptResponseBody>, next: NextFunction) => {
  try {
    // todo: try to find something like named routes instead of this path enums
    validate(Path.v1_purchase_create, req.body)
    const recordMetadata = await produce<PurchaseCreateEventData>(EventType.bwr_purchase_created, {
      title: 'Untitled purchase',
      date: new Date(),
      ...req.body,
    })
    console.log(recordMetadata) // todo: add logging
    // const date = new Date(recordMetadata.timestamp) // todo: compute retry-after date from timestamp
    res.status(202).setHeader('Retry-After', 5).json({ acceptedAt: new Date() })
  } catch (err) {
    next(err)
  }
})

router.patch(Path.v1_purchase_update, async (req: Request<{ id: string }, any, PurchaseUpdateBody>, res: Response<AcceptResponseBody>, next: NextFunction) => {
  try {
    validate(Path.v1_purchase_update, req.body)
    const recordMetadata = await produce<PurchaseUpdateEventData>(EventType.bwr_purchase_updated, {
      ...req.body,
      id: req.params.id,
    })
    console.log(recordMetadata)
    res.status(202).setHeader('Retry-After', 5).json({ acceptedAt: new Date() })
  } catch (e) {
    return next(e)
  }
})

// todo: replace with one path with action: /v1/debts/{action}?
router.post([Path.v1_debts_payoff, Path.v1_debts_accept], async (req: Request<any, any, DebtsBody>, res: Response<AcceptResponseBody>, next: NextFunction) => {
  try {
    validate(Path.v1_debts_payoff, req.body)
    const ceType = req.path === Path.v1_debts_payoff ? EventType.bwr_debts_paid : EventType.bwr_debts_accepted
    const recordMetadata = await produce(ceType, req.body.debts)
    console.log(recordMetadata)
    res.status(202).setHeader('Retry-After', 5).json({ acceptedAt: new Date() })
  } catch (e) {
    return next(e)
  }
})

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response<ErrorResponseBody>, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message, errors: err.errors })
  }
  // todo: do not pass raw errors, may contains internal data (connection params etc)
  res.status(500).json({ message: err.message })
  next(err)
}

router.use(errorHandler)

export { router }