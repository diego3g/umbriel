import { Either, left, right } from '@core/logic/Either'

import { InvalidEmailError } from './errors/InvalidEmailError'

export class Email {
  private readonly email: string

  get value(): string {
    return this.email
  }

  private constructor(email: string) {
    this.email = email
  }

  static validate(email: string): boolean {
    if (!email || email.trim().length > 255) {
      return false
    }

    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!regex.test(email)) {
      return false
    }

    return true
  }

  static format(email: string) {
    return email.trim().toLowerCase()
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    if (!this.validate(email)) {
      return left(new InvalidEmailError(email))
    }

    const formattedEmail = this.format(email)

    return right(new Email(formattedEmail))
  }
}
