import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidTitleLengthError extends Error implements DomainError {
  constructor() {
    super(`The title must have between 3 and 250 characters.`)
    this.name = 'InvalidTitleLengthError'
  }
}
