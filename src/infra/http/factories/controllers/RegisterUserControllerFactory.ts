import { Controller } from '@core/infra/Controller'
import { CompareFieldsValidator } from '@infra/validation/CompareFieldsValidator'
import { ValidatorCompositor } from '@infra/validation/Compositor'
// import { RequiredFieldsValidator } from '@infra/validation/RequiredFieldsValidator'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { RegisterUser } from '@modules/accounts/useCases/RegisterUser/RegisterUser'
import { RegisterUserController } from '@modules/accounts/useCases/RegisterUser/RegisterUserController'

export function makeRegisterUserController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository()
  const registerUser = new RegisterUser(prismaUsersRepository)

  const validator = new ValidatorCompositor([
    // new RequiredFieldsValidator(),
    new CompareFieldsValidator('password', 'password_confirmation'),
  ])

  const registerUserController = new RegisterUserController(
    validator,
    registerUser
  )

  return registerUserController
}
