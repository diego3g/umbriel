// import { KafkaJSNonRetriableError } from 'kafkajs'

import { adaptKafkaHandler } from './adapters/KafkaHandlerAdapter'
import { kafka } from './client'
import { makeDeleteUserHandler } from './factories/DeleteUserHandlerFactory'
import { makeSubscribeUserHandler } from './factories/SubscribeUserHandlerFactory'
import { makeUnsubscribeUserHandler } from './factories/UnsubscribeUserHandlerFactory'
import { makeUpdateTeamTitleHandler } from './factories/UpdateTeamTitleHandlerFactory'
import { makeUpdateUserInfoHandler } from './factories/UpdateUserInfoHandlerFactory'

export const consumer = kafka.consumer({
  groupId: 'umbriel-consumer',
  allowAutoTopicCreation: true,
  // retry: {
  //   async restartOnFailure(err: KafkaJSNonRetriableError) {
  //     if (err.name === 'KafkaJSNumberOfRetriesExceeded') {
  //     } else {
  //     }

  //     return false
  //   },
  // },
})

const topics = [
  'umbriel.subscribe-to-tag',
  'umbriel.unsubscribe-from-tags',
  'umbriel.change-user-info',
  'umbriel.delete-user',
  'umbriel.change-team-info',
] as const

type Topic = typeof topics[number]

const subscribeUserHandler = adaptKafkaHandler(makeSubscribeUserHandler())
const unsubscribeUserHandler = adaptKafkaHandler(makeUnsubscribeUserHandler())
const updateUserInfoHandler = adaptKafkaHandler(makeUpdateUserInfoHandler())
const deleteUserHandler = adaptKafkaHandler(makeDeleteUserHandler())
const updateTeamTitleHandler = adaptKafkaHandler(makeUpdateTeamTitleHandler())

export async function start() {
  await consumer.connect()

  await Promise.all(
    topics.map(topic => {
      return consumer.subscribe({ topic })
    })
  )

  await consumer.run({
    async eachMessage({ topic, message }) {
      try {
        switch (topic as Topic) {
          case 'umbriel.subscribe-to-tag':
            await subscribeUserHandler(message)
            break
          case 'umbriel.unsubscribe-from-tags':
            await unsubscribeUserHandler(message)
            break
          case 'umbriel.change-user-info':
            await updateUserInfoHandler(message)
            break
          case 'umbriel.delete-user':
            await deleteUserHandler(message)
            break
          case 'umbriel.change-team-info':
            await updateTeamTitleHandler(message)
            break
          default:
            console.error(`Kafka topic not handled: ${topic}`)
            break
        }
      } catch (err) {
        console.log(`Error for message: ${message.value.toString()}`)
        console.error(err)
      }
    },
  })
}
