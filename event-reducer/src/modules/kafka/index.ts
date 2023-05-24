import dotenv from 'dotenv'
import { Kafka as KafkaJS, KafkaConfig } from 'kafkajs'
import { CloudEventV1, Headers, Kafka as KafkaCE, KafkaMessage } from 'cloudevents'
import { EventData } from '../../../../shared/kafka/dist/index.js'

dotenv.config()

const kafkaConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
}
const kafka = new KafkaJS(kafkaConfig)
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'bwr.purchases'

const consumer = kafka.consumer({
  groupId: 'bwr-group',
  allowAutoTopicCreation: true,
})

await consumer.connect()
await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true })

export default function consume<T extends EventData>(eventHandler: (type: string, data: T | undefined) => void) {
  return consumer.run({
    eachMessage: async ({ message }) => {
      const headers: Headers = {}
      Object.keys(message.headers as object).forEach(key => {
        headers[key] = message.headers?.[key]?.toString()
      })
      const kafkaMessage = {
        headers,
        value: message.value?.toString(),
      }
      const cloudEvent = KafkaCE.toEvent<T>(kafkaMessage as KafkaMessage) as CloudEventV1<T>
      // console.log(cloudEvent)
      eventHandler(cloudEvent.type, cloudEvent.data)
    },
  })
}
export * from '../../../../shared/kafka/dist/index.js'