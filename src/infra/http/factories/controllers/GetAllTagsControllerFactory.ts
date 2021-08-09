import { Controller } from '@core/infra/Controller'
import { PrismaTagsRepository } from '@modules/subscriptions/repositories/prisma/PrismaTagsRepository'
import { GetAllTags } from '@modules/subscriptions/useCases/GetAllTags/GetAllTags'
import { GetAllTagsController } from '@modules/subscriptions/useCases/GetAllTags/GetAllTagsController'

export function makeGetAllTagsController(): Controller {
  const prismaTagsRepository = new PrismaTagsRepository()
  const getAllTags = new GetAllTags(prismaTagsRepository)
  const getAllTagsController = new GetAllTagsController(getAllTags)

  return getAllTagsController
}
