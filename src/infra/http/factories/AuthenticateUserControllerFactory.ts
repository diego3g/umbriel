import { Controller } from '@core/infra/Controller'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { AuthenticateUser } from '@modules/accounts/useCases/AuthenticateUser/AuthenticateUser'
import { AuthenticateUserController } from '@modules/accounts/useCases/AuthenticateUser/AuthenticateUserController'

export function makeAuthenticateUserController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository()
  const authenticateUser = new AuthenticateUser(prismaUsersRepository)
  const authenticateUserController = new AuthenticateUserController(
    authenticateUser
  )

  return authenticateUserController
}
