import { Controller } from '@core/infra/Controller'
import { PrismaRecipientsRepository } from '@modules/broadcasting/repositories/prisma/PrismaRecipientsRepository'
import { RegisterEvent } from '@modules/broadcasting/useCases/RegisterEvent/RegisterEvent'
import { RegisterEventController } from '@modules/broadcasting/useCases/RegisterEvent/RegisterEventController'

export function makeRegisterEventController(): Controller {
  const prismaRecipientsRepository = new PrismaRecipientsRepository()
  const registerEvent = new RegisterEvent(prismaRecipientsRepository)
  const registerEventController = new RegisterEventController(registerEvent)

  return registerEventController
}
