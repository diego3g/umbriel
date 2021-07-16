import { Controller } from '@core/infra/Controller'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { BlockContact } from '@modules/subscriptions/useCases/BlockContact/BlockContact'
import { BlockContactController } from '@modules/subscriptions/useCases/BlockContact/BlockContactController'

export function makeBlockContactController(): Controller {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const blockContact = new BlockContact(prismaContactsRepository)
  const blockContactController = new BlockContactController(blockContact)

  return blockContactController
}
