import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
  clientId: 'umbriel',
  brokers: process.env.KAFKA_BROKERS.split(','),
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
})
