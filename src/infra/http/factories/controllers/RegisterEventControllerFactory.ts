import { Controller } from '@core/infra/Controller'
import { PrismaRecipientsRepository } from '@modules/broadcasting/repositories/prisma/PrismaRecipientsRepository'
import { RegisterEvent } from '@modules/broadcasting/useCases/RegisterEvent/RegisterEvent'
import { RegisterEventController } from '@modules/broadcasting/useCases/RegisterEvent/RegisterEventController'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { PrismaSubscriptionsRepository } from '@modules/subscriptions/repositories/prisma/PrismaSubscriptionsRepository'

export function makeRegisterEventController(): Controller {
  const prismaRecipientsRepository = new PrismaRecipientsRepository()
  const prismaSubscriptionsRepository = new PrismaSubscriptionsRepository()
  const prismaContactsRepository = new PrismaContactsRepository(
    prismaSubscriptionsRepository
  )
  const registerEvent = new RegisterEvent(
    prismaRecipientsRepository,
    prismaContactsRepository
  )
  const registerEventController = new RegisterEventController(registerEvent)

  return registerEventController
}
