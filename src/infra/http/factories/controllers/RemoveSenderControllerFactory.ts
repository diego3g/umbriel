import { Controller } from '@core/infra/Controller'
import { PrismaSendersRepository } from '@modules/senders/repositories/prisma/PrismaSendersRepository'
import { RemoveSender } from '@modules/senders/useCases/RemoveSender/RemoveSender'
import { RemoveSenderController } from '@modules/senders/useCases/RemoveSender/RemoveSenderController'

export function makeRemoveSenderController(): Controller {
  const prismaSendersRepository = new PrismaSendersRepository()
  const removeSender = new RemoveSender(prismaSendersRepository)
  const removeSenderController = new RemoveSenderController(removeSender)

  return removeSenderController
}
