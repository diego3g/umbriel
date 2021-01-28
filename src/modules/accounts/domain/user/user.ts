import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'

import { Email } from './email'
import { InvalidEmailError } from './errors/InvalidEmailError'
import { InvalidNameError } from './errors/InvalidNameError'
import { InvalidPasswordLengthError } from './errors/InvalidPasswordLengthError'
import { Name } from './name'
import { Password } from './password'

interface IUserProps {
  name: Name
  email: Email
  password: Password
}

export class User extends Entity<IUserProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  private constructor(props: IUserProps, id?: string) {
    super(props, id)
  }

  static create(
    props: IUserProps,
    id?: string
  ): Either<
    InvalidNameError | InvalidEmailError | InvalidPasswordLengthError,
    User
  > {
    const user = new User(props, id)

    return right(user)
  }
}
