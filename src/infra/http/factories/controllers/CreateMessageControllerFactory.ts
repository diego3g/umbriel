import { Controller } from '@core/infra/Controller'
import { PrismaMessagesRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessagesRepository'
import { PrismaMessageTagsRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessageTagsRepository'
import { PrismaTemplatesRepository } from '@modules/broadcasting/repositories/prisma/PrismaTemplatesRepository'
import { CreateMessage } from '@modules/broadcasting/useCases/CreateMessage/CreateMessage'
import { CreateMessageController } from '@modules/broadcasting/useCases/CreateMessage/CreateMessageController'

export function makeCreateMessageController(): Controller {
  const messageTagsRepository = new PrismaMessageTagsRepository()
  const prismaMessagesRepository = new PrismaMessagesRepository(
    messageTagsRepository
  )
  const prismaTemplatesRepository = new PrismaTemplatesRepository()

  const createMessage = new CreateMessage(
    prismaMessagesRepository,
    prismaTemplatesRepository
  )
  const createMessageController = new CreateMessageController(createMessage)

  return createMessageController
}
