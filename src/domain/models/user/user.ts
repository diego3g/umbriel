import { v4 as uuid } from 'uuid'

import { Name } from '../shared/name'
import { Email } from '../shared/email'
import { Password } from './password'
import { InvalidNameError } from '../shared/errors/InvalidNameError'
import { InvalidEmailError } from '../shared/errors/InvalidEmailError'
import { InvalidPasswordLengthError } from './errors/InvalidPasswordLengthError'
import { Either, left, right } from '../../../core/logic/Either'

interface IUserData {
  name: Name
  email: Email
  password: Password
}

export interface IUserCreateData {
  name: string
  email: string
  password: string
}

export class User {
  public readonly id: string
  public readonly name: Name
  public readonly email: Email
  public readonly password: Password

  private constructor({ name, email, password }: IUserData, id?: string) {
    this.name = name
    this.email = email
    this.password = password

    this.id = id ?? uuid()
  }

  static create(
    userData: IUserCreateData,
    id?: string
  ): Either<
    InvalidNameError | InvalidEmailError | InvalidPasswordLengthError,
    User
  > {
    const nameOrError = Name.create(userData.name)
    const emailOrError = Email.create(userData.email)
    const passwordOrError = Password.create(userData.password)

    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value)
    }

    const user = new User(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
      },
      id
    )

    return right(user)
  }
}
