import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { PrismaTagsRepository } from '@modules/subscriptions/repositories/prisma/PrismaTagsRepository'
import { SubscribeContactFromIntegration } from '@modules/subscriptions/useCases/SubscribeContactFromIntegration/SubscribeContactFromIntegration'

import { SubscribeUserHandler } from '../handlers/SubscribeUserHandler'

export function makeSubscribeUserHandler() {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const prismaTagsRepository = new PrismaTagsRepository()

  const subscribeContactFromIntegration = new SubscribeContactFromIntegration(
    prismaTagsRepository,
    prismaContactsRepository,
    prismaSubscriptionsRepository
  )

  const subscribeUserHandler = new SubscribeUserHandler(
    subscribeContactFromIntegration
  )

  return subscribeUserHandler
}
