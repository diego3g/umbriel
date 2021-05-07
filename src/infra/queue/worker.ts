import 'dotenv/config'

import { MailLogProvider } from '@infra/providers/implementations/mail/MailLogProvider'
import { BullProvider } from '@infra/providers/implementations/queue/BullProvider'
import { DeliverMessageToRecipient } from '@modules/broadcasting/useCases/DeliverMessageToRecipient/DeliverMessageToRecipient'

const mailQueueProvider = new BullProvider()
const mailProvider = new MailLogProvider()
const deliverMessageToRecipient = new DeliverMessageToRecipient(mailProvider)

mailQueueProvider.process(async ({ data }) => {
  await deliverMessageToRecipient.execute(data)
})
