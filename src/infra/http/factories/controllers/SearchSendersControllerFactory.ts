import { Controller } from '@core/infra/Controller'
import { PrismaSendersRepository } from '@modules/senders/repositories/prisma/PrismaSendersRepository'
import { SearchSenders } from '@modules/senders/useCases/SearchSenders/SearchSenders'
import { SearchSendersController } from '@modules/senders/useCases/SearchSenders/SearchSendersController'

export function makeSearchSendersController(): Controller {
  const prismaSendersRepository = new PrismaSendersRepository()
  const searchSenders = new SearchSenders(prismaSendersRepository)
  const searchSendersController = new SearchSendersController(searchSenders)

  return searchSendersController
}
