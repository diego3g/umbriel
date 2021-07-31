import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { PrismaTagsRepository } from '@modules/subscriptions/repositories/prisma/PrismaTagsRepository'
import { UnsubscribeContactFromIntegration } from '@modules/subscriptions/useCases/UnsubscribeContactFromIntegration/UnsubscribeContactFromIntegration'

import { UnsubscribeUserHandler } from '../handlers/UnsubscribeUserHandler'

export function makeUnsubscribeUserHandler() {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const prismaTagsRepository = new PrismaTagsRepository()

  const unsubscribeContactFromIntegration =
    new UnsubscribeContactFromIntegration(
      prismaTagsRepository,
      prismaSubscriptionsRepository,
      prismaContactsRepository
    )

  const unsubscribeUserHandler = new UnsubscribeUserHandler(
    unsubscribeContactFromIntegration
  )

  return unsubscribeUserHandler
}
