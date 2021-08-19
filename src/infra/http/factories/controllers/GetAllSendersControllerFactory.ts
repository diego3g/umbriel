import { Controller } from '@core/infra/Controller'
import { PrismaSendersRepository } from '@modules/senders/repositories/prisma/PrismaSendersRepository'
import { GetAllSenders } from '@modules/senders/useCases/GetAllSenders/GetAllSenders'
import { GetAllSendersController } from '@modules/senders/useCases/GetAllSenders/GetAllSendersController'

export function makeGetAllSendersController(): Controller {
  const prismaSendersRepository = new PrismaSendersRepository()
  const getAllSenders = new GetAllSenders(prismaSendersRepository)
  const getAllSendersController = new GetAllSendersController(getAllSenders)

  return getAllSendersController
}
