import { Controller } from '@core/infra/Controller'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { UnsubscribeContact } from '@modules/subscriptions/useCases/UnsubscribeContact/UnsubscribeContact'
import { UnsubscribeContactController } from '@modules/subscriptions/useCases/UnsubscribeContact/UnsubscribeContactController'

export function makeUnsubscribeContactController(): Controller {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const unsubscribeContact = new UnsubscribeContact(prismaContactsRepository)
  const unsubscribeContactController = new UnsubscribeContactController(
    unsubscribeContact
  )

  return unsubscribeContactController
}
