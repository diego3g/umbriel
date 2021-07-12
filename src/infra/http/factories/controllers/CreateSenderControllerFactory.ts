import { Controller } from '@core/infra/Controller'
import { PrismaSendersRepository } from '@modules/senders/repositories/prisma/PrismaSendersRepository'
import { CreateSender } from '@modules/senders/useCases/CreateSender/CreateSender'
import { CreateSenderController } from '@modules/senders/useCases/CreateSender/CreateSenderController'

export function makeCreateSenderController(): Controller {
  const prismaSendersRepository = new PrismaSendersRepository()
  const createSender = new CreateSender(prismaSendersRepository)
  const createSenderController = new CreateSenderController(createSender)

  return createSenderController
}
