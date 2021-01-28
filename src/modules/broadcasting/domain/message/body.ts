import { Either, left, right } from '@core/logic/Either'

import { InvalidBodyLengthError } from './errors/InvalidBodyLengthError'

export class Body {
  private readonly body: string

  get value(): string {
    return this.body
  }

  private constructor(body: string) {
    this.body = body
  }

  static validate(body: string): boolean {
    if (!body || body.trim().length <= 20) {
      return false
    }

    return true
  }

  static create(body: string): Either<InvalidBodyLengthError, Body> {
    if (!this.validate(body)) {
      return left(new InvalidBodyLengthError())
    }

    return right(new Body(body))
  }
}
