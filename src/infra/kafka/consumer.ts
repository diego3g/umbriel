import { adaptKafkaHandler } from './adapters/KafkaHandlerAdapter'
import { kafka } from './client'
import { makeSubscribeUserHandler } from './factories/SubscribeUserHandlerFactory'

export const consumer = kafka.consumer({
  groupId: 'umbriel-consumer',
  allowAutoTopicCreation: true,
})

const topics = [
  'umbriel.subscribe-to-tag',
  'umbriel.unsubscribe-from-tags',
  'umbriel.change-user-info',
  'umbriel.delete-user',
] as const

type Topic = typeof topics[number]

const subscribeUserHandler = adaptKafkaHandler(makeSubscribeUserHandler())

export async function start() {
  await consumer.connect()

  await Promise.all(
    topics.map(topic => {
      return consumer.subscribe({ topic })
    })
  )

  await consumer.run({
    async eachMessage({ topic, message }) {
      switch (topic as Topic) {
        case 'umbriel.subscribe-to-tag':
          await subscribeUserHandler(message)
          break
        case 'umbriel.unsubscribe-from-tags':
          break
        case 'umbriel.change-user-info':
          break
        case 'umbriel.delete-user':
          break
        default:
          console.error(`Kafka topic not handled: ${topic}`)
          break
      }
    },
  })
}
