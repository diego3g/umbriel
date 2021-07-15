import { Controller } from '@core/infra/Controller'
import { PrismaTemplatesRepository } from '@modules/broadcasting/repositories/prisma/PrismaTemplatesRepository'
import { SetDefaultTemplate } from '@modules/broadcasting/useCases/SetDefaultTemplate/SetDefaultTemplate'
import { SetDefaultTemplateController } from '@modules/broadcasting/useCases/SetDefaultTemplate/SetDefaultTemplateController'

export function makeSetDefaultTemplateController(): Controller {
  const prismaTemplatesRepository = new PrismaTemplatesRepository()
  const setDefaultTemplate = new SetDefaultTemplate(prismaTemplatesRepository)
  const setDefaultTemplateController = new SetDefaultTemplateController(
    setDefaultTemplate
  )

  return setDefaultTemplateController
}
