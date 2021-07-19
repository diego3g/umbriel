import { Controller } from '@core/infra/Controller'
import { CountRecipientsFromTags } from '@modules/broadcasting/useCases/CountRecipientsFromTags/CountRecipientsFromTags'
import { CountRecipientsFromTagsController } from '@modules/broadcasting/useCases/CountRecipientsFromTags/CountRecipientsFromTagsController'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'

export function makeCountRecipientsFromTagsController(): Controller {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const countRecipientsFromTags = new CountRecipientsFromTags(
    prismaContactsRepository
  )
  const countRecipientsFromTagsController =
    new CountRecipientsFromTagsController(countRecipientsFromTags)

  return countRecipientsFromTagsController
}
