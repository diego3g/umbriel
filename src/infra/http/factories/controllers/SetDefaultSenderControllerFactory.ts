import { Controller } from '@core/infra/Controller'
import { PrismaSendersRepository } from '@modules/senders/repositories/prisma/PrismaSendersRepository'
import { SetDefaultSender } from '@modules/senders/useCases/SetDefaultSender/SetDefaultSender'
import { SetDefaultSenderController } from '@modules/senders/useCases/SetDefaultSender/SetDefaultSenderController'

export function makeSetDefaultSenderController(): Controller {
  const prismaSendersRepository = new PrismaSendersRepository()
  const setDefaultSender = new SetDefaultSender(prismaSendersRepository)
  const setDefaultSenderController = new SetDefaultSenderController(
    setDefaultSender
  )

  return setDefaultSenderController
}
