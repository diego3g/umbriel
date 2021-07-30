import { config } from 'dotenv-flow'

config({ silent: true })

import { start } from './consumer' // eslint-disable-line

start().then(() => {
  console.log(`Kafka running!`)
})
