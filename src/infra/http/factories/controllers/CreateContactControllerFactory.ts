import { Controller } from '@core/infra/Controller'
import { PrismaContactsRepository } from '@modules/subscriptions/repositories/prisma/PrismaContactsRepository'
import { CreateContact } from '@modules/subscriptions/useCases/CreateContact/CreateContact'
import { CreateContactController } from '@modules/subscriptions/useCases/CreateContact/CreateContactController'

export function makeCreateContactController(): Controller {
  const prismaContactsRepository = new PrismaContactsRepository()
  const createContact = new CreateContact(prismaContactsRepository)
  const createContactController = new CreateContactController(createContact)

  return createContactController
}
