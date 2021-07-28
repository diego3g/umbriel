import { KafkaMessage } from 'kafkajs'

import { KafkaHandler } from '@core/infra/KafkaHandler'

export const adaptKafkaHandler = (handler: KafkaHandler) => {
  return async (message: KafkaMessage) => {
    await handler.handle(JSON.parse(message.value.toString()))
  }
}
