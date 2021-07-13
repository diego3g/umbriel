import { Controller } from '@core/infra/Controller'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { PrismaTagsRepository } from '@modules/subscriptions/repositories/prisma/PrismaTagsRepository'
import { UnsubscribeContactFromTag } from '@modules/subscriptions/useCases/UnsubscribeContactFromTag/UnsubscribeContactFromTag'
import { UnsubscribeContactFromTagController } from '@modules/subscriptions/useCases/UnsubscribeContactFromTag/UnsubscribeContactFromTagController'

export function makeUnsubscribeContactFromTagController(): Controller {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const prismaTagsRepository = new PrismaTagsRepository()
  const unsubscribeContactFromTag = new UnsubscribeContactFromTag(
    prismaSubscriptionsRepository,
    prismaContactsRepository,
    prismaTagsRepository
  )
  const unsubscribeContactFromTagController =
    new UnsubscribeContactFromTagController(unsubscribeContactFromTag)

  return unsubscribeContactFromTagController
}
