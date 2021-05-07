import { Controller } from '@core/infra/Controller'
import { BullProvider } from '@infra/providers/implementations/queue/BullProvider'
import { PrismaMessagesRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessagesRepository'
import { PrismaMessageTagsRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessageTagsRepository'
import { PrismaTemplatesRepository } from '@modules/broadcasting/repositories/prisma/PrismaTemplatesRepository'
import { SendMessage } from '@modules/broadcasting/useCases/SendMessage/SendMessage'
import { SendMessageController } from '@modules/broadcasting/useCases/SendMessage/SendMessageController'
import { PrismaSendersRepository } from '@modules/senders/repositories/prisma/PrismaSendersRepository'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'

export function makeSendMessageController(): Controller {
  const messageTagsRepository = new PrismaMessageTagsRepository()
  const messagesRepository = new PrismaMessagesRepository(messageTagsRepository)
  const templatesRepository = new PrismaTemplatesRepository()
  const contactsRepository = new PrismaContactsRepository()
  const sendersRepository = new PrismaSendersRepository()
  const mailQueueProvider = new BullProvider()

  const sendMessage = new SendMessage(
    messagesRepository,
    messageTagsRepository,
    templatesRepository,
    contactsRepository,
    sendersRepository,
    mailQueueProvider
  )

  const sendMessageController = new SendMessageController(sendMessage)

  return sendMessageController
}
