import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidSubjectLengthError extends Error implements DomainError {
  constructor() {
    super(`The message subject must contains between 5 and 80 characters.`)
    this.name = 'InvalidSubjectLengthError'
  }
}
