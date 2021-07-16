import { Controller } from '@core/infra/Controller'
import { PrismaMessagesRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessagesRepository'
import { PrismaMessageTagsRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessageTagsRepository'
import { GetMessageStats } from '@modules/broadcasting/useCases/GetMessageStats/GetMessageStats'
import { GetMessageStatsController } from '@modules/broadcasting/useCases/GetMessageStats/GetMessageStatsController'

export function makeGetMessageStatsController(): Controller {
  const prismaMessageTagsRepository = new PrismaMessageTagsRepository()
  const prismaMessagesRepository = new PrismaMessagesRepository(
    prismaMessageTagsRepository
  )
  const getMessageStats = new GetMessageStats(prismaMessagesRepository)
  const getMessageStatsController = new GetMessageStatsController(
    getMessageStats
  )

  return getMessageStatsController
}
