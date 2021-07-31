import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { UpdateContactFromIntegration } from '@modules/subscriptions/useCases/UpdateContactFromIntegration/UpdateContactFromIntegration'

import { UpdateUserInfoHandler } from '../handlers/UpdateUserInfoHandler'

export function makeUpdateUserInfoHandler() {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )

  const updateContactFromIntegration = new UpdateContactFromIntegration(
    prismaContactsRepository
  )

  const updateUserInfoHandler = new UpdateUserInfoHandler(
    updateContactFromIntegration
  )

  return updateUserInfoHandler
}
