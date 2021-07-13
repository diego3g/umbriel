import { Controller } from '@core/infra/Controller'
import { PrismaTemplatesRepository } from '@modules/broadcasting/repositories/prisma/PrismaTemplatesRepository'
import { CreateTemplate } from '@modules/broadcasting/useCases/CreateTemplate/CreateTemplate'
import { CreateTemplateController } from '@modules/broadcasting/useCases/CreateTemplate/CreateTemplateController'

export function makeCreateTemplateController(): Controller {
  const prismaTemplatesRepository = new PrismaTemplatesRepository()
  const createTemplate = new CreateTemplate(prismaTemplatesRepository)
  const createTemplateController = new CreateTemplateController(createTemplate)

  return createTemplateController
}
