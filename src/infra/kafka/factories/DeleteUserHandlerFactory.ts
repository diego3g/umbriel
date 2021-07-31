import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { DeleteContactFromIntegration } from '@modules/subscriptions/useCases/DeleteContactFromIntegration/DeleteContactFromIntegration'

import { DeleteUserHandler } from '../handlers/DeleteUserHandler'

export function makeDeleteUserHandler() {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )

  const deleteContactFromIntegration = new DeleteContactFromIntegration(
    prismaContactsRepository
  )

  const deleteUserHandler = new DeleteUserHandler(deleteContactFromIntegration)

  return deleteUserHandler
}
