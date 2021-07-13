import { Controller } from '@core/infra/Controller'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'
import { GetContactDetails } from '@modules/subscriptions/useCases/GetContactDetails/GetContactDetails'
import { GetContactDetailsController } from '@modules/subscriptions/useCases/GetContactDetails/GetContactDetailsController'

export function makeGetContactDetailsController(): Controller {
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const getContactDetails = new GetContactDetails(prismaContactsRepository)
  const getContactDetailsController = new GetContactDetailsController(
    getContactDetails
  )

  return getContactDetailsController
}
