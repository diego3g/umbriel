import { Controller } from '@core/infra/Controller'
import { PrismaTagsRepository } from '@modules/subscriptions/repositories/prisma/PrismaTagsRepository'
import { SearchTags } from '@modules/subscriptions/useCases/SearchTags/SearchTags'
import { SearchTagsController } from '@modules/subscriptions/useCases/SearchTags/SearchTagsController'

export function makeSearchTagsController(): Controller {
  const prismaTagsRepository = new PrismaTagsRepository()
  const searchTags = new SearchTags(prismaTagsRepository)
  const searchTagsController = new SearchTagsController(searchTags)

  return searchTagsController
}
