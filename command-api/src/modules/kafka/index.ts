import dotenv from 'dotenv'
import { ConnectEvent, Kafka as KafkaJS, KafkaConfig, ProducerConfig, RecordMetadata } from 'kafkajs'
import { CloudEvent } from 'cloudevents'
import { EventData, EventType } from './models.js'
import { Kafka as KafkaCE } from 'cloudevents/dist/message/kafka/index.js'

dotenv.config()

const kafkaConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  retry: {
    retries: 0,
  },
}
const kafka = new KafkaJS(kafkaConfig)
const DEFAULT_TOPIC = process.env.KAFKA_DEFAULT_TOPIC || 'bwr.purchases'
const producerConfig: ProducerConfig = {
  allowAutoTopicCreation: true,
}
const producer = kafka.producer(producerConfig)

producer.connect().catch(e => {
  console.log('Broker connection error', e)
})
producer.on(producer.events.CONNECT, (event: ConnectEvent) => {
  console.log('Connected to broker', event)
})

export async function produce<T extends EventData>(type: EventType, data: T, topic: string = DEFAULT_TOPIC) {
  await producer.connect()
  const event = new CloudEvent<T>({
    source: '/',
    type: type,
    data: data,
    datacontenttype: 'application/json',
    // todo: add schema validation per type basis?
    // dataschema: 'https://bws.site/schemas/bwr.purchase.created.json'
  })
  const kafkaMessage = KafkaCE.structured<T>(event)
  return await producer.send({
    topic,
    messages: [
      {
        value: kafkaMessage.body as string,
        headers: kafkaMessage.headers,
        // key: // TODO: add kafka key
      },
    ],
  }).then((recordMetadata: RecordMetadata[]) => recordMetadata.pop())
}