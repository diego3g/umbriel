import { Either, left, right } from '@core/logic/Either'

import { JWT } from '../../domain/user/jwt'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { InvalidEmailOrPasswordError } from './errors/InvalidEmailOrPasswordError'

type TokenResponse = {
  token: string
}

type AuthenticateUserRequest = {
  email: string
  password: string
}

type AuthenticateUserResponse = Either<
  InvalidEmailOrPasswordError,
  TokenResponse
>

export class AuthenticateUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidEmailOrPasswordError())
    }

    const isPasswordValid = await user.password.comparePassword(password)

    if (isPasswordValid === false) {
      return left(new InvalidEmailOrPasswordError())
    }

    const { token } = JWT.signUser(user)

    return right({ token })
  }
}
