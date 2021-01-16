import { Either, left, right } from '../../../core/logic/Either'
import { InvalidEmailError } from '../../models/shared/errors/InvalidEmailError'
import { InvalidNameError } from '../../models/shared/errors/InvalidNameError'
import { InvalidPasswordLengthError } from '../../models/user/errors/InvalidPasswordLengthError'
import { IUserCreateData, User } from '../../models/user/user'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError'

type RegisterUserResponse = Either<
  | AccountAlreadyExistsError
  | InvalidNameError
  | InvalidEmailError
  | InvalidPasswordLengthError,
  User
>

export class RegisterUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(userData: IUserCreateData): Promise<RegisterUserResponse> {
    const userOrError = User.create(userData)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const user = userOrError.value

    const userAlreadyExists = await this.usersRepository.exists(
      user.email.value
    )

    if (userAlreadyExists) {
      return left(new AccountAlreadyExistsError(user.email.value))
    }

    await this.usersRepository.create(user)

    return right(user)
  }
}
