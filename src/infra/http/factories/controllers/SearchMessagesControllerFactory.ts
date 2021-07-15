import { Controller } from '@core/infra/Controller'
import { PrismaMessagesRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessagesRepository'
import { PrismaMessageTagsRepository } from '@modules/broadcasting/repositories/prisma/PrismaMessageTagsRepository'
import { SearchMessages } from '@modules/broadcasting/useCases/SearchMessages/SearchMessages'
import { SearchMessagesController } from '@modules/broadcasting/useCases/SearchMessages/SearchMessagesController'

export function makeSearchMessagesController(): Controller {
  const prismaMessageTagsRepository = new PrismaMessageTagsRepository()
  const prismaMessagesRepository = new PrismaMessagesRepository(
    prismaMessageTagsRepository
  )
  const searchMessages = new SearchMessages(prismaMessagesRepository)
  const searchMessagesController = new SearchMessagesController(searchMessages)

  return searchMessagesController
}
