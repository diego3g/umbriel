import { Either, left, right } from '@core/logic/Either'

import { InvalidSubjectLengthError } from './errors/InvalidSubjectLengthError'

export class Subject {
  private readonly subject: string

  get value(): string {
    return this.subject
  }

  private constructor(subject: string) {
    this.subject = subject
  }

  static validate(subject: string): boolean {
    if (!subject || subject.trim().length < 4 || subject.trim().length > 80) {
      return false
    }

    return true
  }

  static create(subject: string): Either<InvalidSubjectLengthError, Subject> {
    if (!this.validate(subject)) {
      return left(new InvalidSubjectLengthError())
    }

    return right(new Subject(subject))
  }
}
