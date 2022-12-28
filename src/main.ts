import dotenv from 'dotenv'
import express, { Express } from 'express'
import { Kafka as KafkaJS } from 'kafkajs'
import { HTTP, CloudEventV1, Kafka as KafkaCE, CloudEvent, Message } from 'cloudevents'
import { PurchaseCreated, PurchaseUpdateData } from './models.js'

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

app.use((req, res, next) => {
  if (!req.body) return res.status(400).send('data is mandatory')
  return next()
})
// app.use((req, res, next) => {
//   let data = ''
//
//   req.setEncoding('utf8')
//   req.on('data', function(chunk) {
//     data += chunk
//   })
//
//   req.on('end', function() {
//     req.body = data
//     next()
//   })
// })

app.post('/v1/purchase', async (req, res, next) => {
  if (!req.body.amount || req.body.amount <= 0) return res.status(400).send('amount is mandatory')
  if (!req.body?.date) req.body.date = new Date()
  try {
    // NOTE: so what are we catching here?
    const event = new CloudEvent<PurchaseCreated>({
      source: '/',
      type: 'bwr.purchase.created',
      data: req.body,
      datacontenttype: 'application/json',
      // todo: add schema validation
      // dataschema: 'https://bws.site/schemas/bwr.purchase.created.json'
    })
    const kafkaMessage = KafkaCE.structured<PurchaseCreated>(event)
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
  } catch (err) {
    console.error(err)

    // todo: do not pass raw errors, may contains internal data (connection params etc)
    res.status(415).header('Content-Type', 'application/json').send(JSON.stringify(err))
  }
})

app.patch('/v1/purchase/:id', async (req, res, next) => {
  if (req.body.amount) return res.status(400).send('amount is read-only')
  if (req.body.payer) return res.status(400).send('payer is read-only')
  if (req.body.debtors) return res.status(400).send('debtors are read-only')
  // todo: more convenient body validation (schema?)
  const event = new CloudEvent<PurchaseUpdateData>({
    source: '/',
    type: 'bwr.purchase.updated',
    data: req.body,
    datacontenttype: 'application/json',
    // todo: add schema validation
    // dataschema: 'https://bws.site/schemas/bwr.purchase.created.json'
  })
  const kafkaMessage = KafkaCE.structured<PurchaseUpdateData>(event)
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
})

app.post('/v1/payoff-debts', async (req, res, next) => {
  // todo: validate request body
  const event = new CloudEvent<string[]>({
    source: '/',
    type: 'bwr.debts.paid',
    data: req.body,
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
})

app.post('/v1/accept-debts', async (req, res, next) => {
  // todo: validate request body
  const event = new CloudEvent<string[]>({
    source: '/',
    type: 'bwr.debts.accepted',
    data: req.body,
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
})

app.listen(port, () => {
  console.log(`BWR listening on port ${port}`)
})