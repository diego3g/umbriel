import { PrismaTagsRepository } from '@modules/subscriptions/repositories/prisma/PrismaTagsRepository'
import { UpdateTagFromIntegration } from '@modules/subscriptions/useCases/UpdateTagFromIntegration/UpdateTagFromIntegration'

import { UpdateTeamTitleHandler } from '../handlers/UpdateTeamTitleHandler'

export function makeUpdateTeamTitleHandler() {
  const prismaTagsRepository = new PrismaTagsRepository()

  const updateContactFromIntegration = new UpdateTagFromIntegration(
    prismaTagsRepository
  )

  const updateTeamTitleHandler = new UpdateTeamTitleHandler(
    updateContactFromIntegration
  )

  return updateTeamTitleHandler
}
