import { Kafka, KafkaConfig } from 'kafkajs'

const config: KafkaConfig = {
  clientId: 'umbriel',
  brokers: process.env.KAFKA_BROKERS.split(','),
}

if (process.env.KAFKA_USERNAME) {
  config.sasl = {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  }
}

export const kafka = new Kafka(config)
