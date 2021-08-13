/* eslint-disable import/first */

import { config } from 'dotenv-flow'

config({ silent: true })

import { SESProvider } from '@infra/providers/implementations/mail/AmazonSESProvider'
import { BullProvider } from '@infra/providers/implementations/queue/BullProvider'
import { DeliverMessageToRecipient } from '@modules/broadcasting/useCases/DeliverMessageToRecipient/DeliverMessageToRecipient'

const mailQueueProvider = new BullProvider()
const mailProvider = new SESProvider()
const deliverMessageToRecipient = new DeliverMessageToRecipient(mailProvider)

mailQueueProvider.process(async ({ data }) => {
  await deliverMessageToRecipient.execute(data)
})
