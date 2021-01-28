import { Either, left, right } from '@core/logic/Either'

import { InvalidTitleLengthError } from './errors/InvalidTitleLengthError'

export class Title {
  private readonly title: string

  get value(): string {
    return this.title
  }

  private constructor(title: string) {
    this.title = title
  }

  static validate(title: string): boolean {
    if (!title || title.trim().length < 4 || title.trim().length > 250) {
      return false
    }

    return true
  }

  static create(title: string): Either<InvalidTitleLengthError, Title> {
    if (!this.validate(title)) {
      return left(new InvalidTitleLengthError())
    }

    return right(new Title(title))
  }
}
