import { Controller } from '@core/infra/Controller'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { CreateContact } from '@modules/subscriptions/useCases/CreateContact/CreateContact'
import { CreateContactController } from '@modules/subscriptions/useCases/CreateContact/CreateContactController'

export function makeCreateContactController(): Controller {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const createContact = new CreateContact(prismaContactsRepository)
  const createContactController = new CreateContactController(createContact)

  return createContactController
}
