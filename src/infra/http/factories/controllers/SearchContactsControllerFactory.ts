import { Controller } from '@core/infra/Controller'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { SearchContacts } from '@modules/subscriptions/useCases/SearchContacts/SearchContacts'
import { SearchContactsController } from '@modules/subscriptions/useCases/SearchContacts/SearchContactsController'

export function makeSearchContactsController(): Controller {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const searchContacts = new SearchContacts(prismaContactsRepository)
  const searchContactsController = new SearchContactsController(searchContacts)

  return searchContactsController
}
