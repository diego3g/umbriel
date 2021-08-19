import { Controller } from '@core/infra/Controller'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { AuthenticateUser } from '@modules/accounts/useCases/AuthenticateUser/AuthenticateUser'
import { AuthenticateUserController } from '@modules/accounts/useCases/AuthenticateUser/AuthenticateUserController'
import { AuthenticateUserValidator } from '@modules/accounts/validation/AuthenticateUserValidator'

export function makeAuthenticateUserController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository()
  const authenticateUser = new AuthenticateUser(prismaUsersRepository)
  const validator = new AuthenticateUserValidator()
  const authenticateUserController = new AuthenticateUserController(
    validator,
    authenticateUser
  )

  return authenticateUserController
}
