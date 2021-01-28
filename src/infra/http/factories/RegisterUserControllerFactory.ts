import { Controller } from '@core/infra/Controller'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { RegisterUser } from '@modules/accounts/useCases/RegisterUser/RegisterUser'
import { RegisterUserController } from '@modules/accounts/useCases/RegisterUser/RegisterUserController'

export function makeRegisterUserController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository()
  const registerUser = new RegisterUser(prismaUsersRepository)
  const registerUserController = new RegisterUserController(registerUser)

  return registerUserController
}
