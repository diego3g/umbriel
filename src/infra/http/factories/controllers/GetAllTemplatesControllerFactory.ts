import { Controller } from '@core/infra/Controller'
import { PrismaTemplatesRepository } from '@modules/broadcasting/repositories/prisma/PrismaTemplatesRepository'
import { GetAllTemplates } from '@modules/broadcasting/useCases/GetAllTemplates/GetAllTemplates'
import { GetAllTemplatesController } from '@modules/broadcasting/useCases/GetAllTemplates/GetAllTemplatesController'

export function makeGetAllTemplatesController(): Controller {
  const prismaTemplatesRepository = new PrismaTemplatesRepository()
  const getAllTemplates = new GetAllTemplates(prismaTemplatesRepository)
  const getAllTemplatesController = new GetAllTemplatesController(
    getAllTemplates
  )

  return getAllTemplatesController
}
