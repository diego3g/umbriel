import { Controller } from '@core/infra/Controller'
import { SESProvider } from '@infra/providers/implementations/mail/AmazonSESProvider'
import { PrismaMessagesRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessagesRepository'
import { PrismaMessageTagsRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessageTagsRepository'
import { SendMessagePreview } from '@modules/broadcasting/useCases/SendMessagePreview/SendMessagePreview'
import { SendMessagePreviewController } from '@modules/broadcasting/useCases/SendMessagePreview/SendMessagePreviewController'

export function makeSendMessagePreviewController(): Controller {
  const prismaMessageTagsRepository = new PrismaMessageTagsRepository()
  const prismaMessagesRepository = new PrismaMessagesRepository(
    prismaMessageTagsRepository
  )
  const mailProvider = new SESProvider()
  const sendMessagePreview = new SendMessagePreview(
    prismaMessagesRepository,
    mailProvider
  )
  const sendMessagePreviewController = new SendMessagePreviewController(
    sendMessagePreview
  )

  return sendMessagePreviewController
}
