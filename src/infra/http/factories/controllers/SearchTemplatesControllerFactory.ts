import { Controller } from '@core/infra/Controller'
import { PrismaTemplatesRepository } from '@modules/broadcasting/repositories/prisma/PrismaTemplatesRepository'
import { SearchTemplates } from '@modules/broadcasting/useCases/SearchTemplates/SearchTemplates'
import { SearchTemplatesController } from '@modules/broadcasting/useCases/SearchTemplates/SearchTemplatesController'

export function makeSearchTemplatesController(): Controller {
  const prismaTemplatesRepository = new PrismaTemplatesRepository()
  const searchTemplates = new SearchTemplates(prismaTemplatesRepository)
  const searchTemplatesController = new SearchTemplatesController(
    searchTemplates
  )

  return searchTemplatesController
}
