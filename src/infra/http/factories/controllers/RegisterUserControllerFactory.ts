import { Controller } from '@core/infra/Controller'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { RegisterUser } from '@modules/accounts/useCases/RegisterUser/RegisterUser'
import { RegisterUserController } from '@modules/accounts/useCases/RegisterUser/RegisterUserController'
import { ValidatorCompositor } from '@modules/accounts/validation/Compositor'
import { EmailValidator } from '@modules/accounts/validation/EmailValidator'
import { NameValidator } from '@modules/accounts/validation/NameValidator'
import { PasswordValidator } from '@modules/accounts/validation/PasswordValidator'

export function makeRegisterUserController(): Controller {
  const emailValidator = new EmailValidator()
  const passwordValidator = new PasswordValidator()
  const nameValidator = new NameValidator()
  const validator = new ValidatorCompositor([
    nameValidator,
    emailValidator,
    passwordValidator,
  ])

  const prismaUsersRepository = new PrismaUsersRepository()
  const registerUser = new RegisterUser(prismaUsersRepository)

  const registerUserController = new RegisterUserController(
    validator,
    registerUser
  )

  return registerUserController
}
