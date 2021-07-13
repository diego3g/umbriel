import { Controller } from '@core/infra/Controller'
import { PrismaTagsRepository } from '@modules/subscriptions/repositories/prisma/PrismaTagsRepository'
import { CreateTag } from '@modules/subscriptions/useCases/CreateTag/CreateTag'
import { CreateTagController } from '@modules/subscriptions/useCases/CreateTag/CreateTagController'

export function makeCreateTagController(): Controller {
  const prismaTagsRepository = new PrismaTagsRepository()
  const createTag = new CreateTag(prismaTagsRepository)
  const createTagController = new CreateTagController(createTag)

  return createTagController
}
