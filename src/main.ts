import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import { Kafka as KafkaJS } from 'kafkajs'
import { CloudEvent, Kafka as KafkaCE } from 'cloudevents'
import {
  DebtsBody, ErrorResponseBody,
  PurchaseCreateBody,
  PurchaseCreateEventData,
  PurchaseUpdateBody,
  PurchaseUpdateEventData,
} from './models.js'
import { validate, ValidationError } from './modules/schemavalidator/index.js'
import { Path } from './path.js'
import { ErrorRequestHandler } from 'express-serve-static-core'

dotenv.config()

const kafka = new KafkaJS(
  {
    clientId: 'bwr_producer',
    brokers: ['localhost:9092'],
  },
)

const producer = kafka.producer()
await producer.connect()

const app: Express = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post(Path.v1_purchase_create, async (req: Request<any, any, PurchaseCreateBody>, res, next) => {
  try {
    // todo: try to find something like named routes instead of this path enums
    validate(Path.v1_purchase_create, req.body)
    // todo: add a factory for cloudevents
    const event = new CloudEvent<PurchaseCreateEventData>({
      source: '/',
      type: 'bwr.purchase.created',
      data: {
        title: 'Untitled purchase',
        date: new Date(),
        ...req.body,
      },
      datacontenttype: 'application/json',
      // todo: add schema validation
      // dataschema: 'https://bws.site/schemas/bwr.purchase.created.json'
    })
    const kafkaMessage = KafkaCE.structured<PurchaseCreateEventData>(event)
    const recordMetadata = await producer.send({
      topic: 'bwr.purchases',
      messages: [
        {
          value: kafkaMessage.body as string,
          headers: kafkaMessage.headers,
          // key: // TODO: add kafka key
        },
      ],
    })

    res.status(202).setHeader('Retry-After', 30).json(recordMetadata)
  } catch (err) {
    next(err)
  }
})

app.patch(Path.v1_purchase_update, async (req: Request<any, any, PurchaseUpdateBody>, res, next) => {
  try {
    validate(Path.v1_purchase_update, req.body)
    const event = new CloudEvent<PurchaseUpdateEventData>({
      source: '/',
      type: 'bwr.purchase.updated',
      data: { ...req.body, id: req.params.id },
      datacontenttype: 'application/json',
      // todo: add schema validation
      // dataschema: 'https://bws.site/schemas/bwr.purchase.created.json'
    })
    const kafkaMessage = KafkaCE.structured<PurchaseUpdateEventData>(event)
    const recordMetadata = await producer.send({
      topic: 'bwr.purchases',
      messages: [
        {
          value: kafkaMessage.body as string,
          headers: kafkaMessage.headers,
          // key: // TODO: add kafka key
        },
      ],
    })
    res.status(202).json(recordMetadata)
  } catch (e) {
    return next(e)
  }
})

app.post([Path.v1_debts_payoff, Path.v1_debts_accept], async (req: Request<any, any, DebtsBody>, res, next) => {
  try {
    validate(Path.v1_debts_payoff, req.body)
    const ceType = req.path === Path.v1_debts_payoff ? 'bwr.debts.paid' : 'bwr.debts.accepted'
    const event = new CloudEvent<string[]>({
      source: '/',
      type: ceType,
      data: req.body.debts,
      datacontenttype: 'application/json',
    })
    const kafkaMessage = KafkaCE.structured<string[]>(event)
    const recordMetadata = await producer.send({
      topic: 'bwr.purchases',
      messages: [
        {
          value: kafkaMessage.body as string,
          headers: kafkaMessage.headers,
          // key: // TODO: add kafka key
        },
      ],
    })
    res.status(202).json(recordMetadata)
  } catch (e) {
    return next(e)
  }
})

const errorHandler: ErrorRequestHandler = (err: Error, req, res: Response<ErrorResponseBody>, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message, errors: err.errors })
  }
  // todo: do not pass raw errors, may contains internal data (connection params etc)
  res.status(500).json({ message: err.message })
  next(err)
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`BWR listening on port ${port}`)
})