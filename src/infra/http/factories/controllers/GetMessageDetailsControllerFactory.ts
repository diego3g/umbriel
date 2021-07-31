import { Controller } from '@core/infra/Controller'
import { PrismaMessagesRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessagesRepository'
import { PrismaMessageTagsRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessageTagsRepository'
import { GetMessageDetails } from '@modules/broadcasting/useCases/GetMessageDetails/GetMessageDetails'
import { GetMessageDetailsController } from '@modules/broadcasting/useCases/GetMessageDetails/GetMessageDetailsController'

export function makeGetMessageDetailsController(): Controller {
  const prismaMessageTagsRepository = new PrismaMessageTagsRepository()
  const prismaMessagesRepository = new PrismaMessagesRepository(
    prismaMessageTagsRepository
  )
  const getMessageDetails = new GetMessageDetails(prismaMessagesRepository)
  const getMessageDetailsController = new GetMessageDetailsController(
    getMessageDetails
  )

  return getMessageDetailsController
}
