import { Controller } from '@core/infra/Controller'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { PrismaTagsRepository } from '@modules/subscriptions/repositories/prisma/PrismaTagsRepository'
import { SubscribeContactToTag } from '@modules/subscriptions/useCases/SubscribeContactToTag/SubscribeContactToTag'
import { SubscribeContactToTagController } from '@modules/subscriptions/useCases/SubscribeContactToTag/SubscribeContactToTagController'

export function makeSubscribeContactToTagController(): Controller {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const prismaTagsRepository = new PrismaTagsRepository()
  const subscribeContactToTag = new SubscribeContactToTag(
    prismaContactsRepository,
    prismaTagsRepository
  )
  const subscribeContactToTagController = new SubscribeContactToTagController(
    subscribeContactToTag
  )

  return subscribeContactToTagController
}
