import { DomainError } from '../../../../../core/errors/DomainError'

export class InvalidTitleLengthError extends Error implements DomainError {
  constructor() {
    super(`The title must have between 5 and 250 characters.`)
    this.name = 'InvalidTitleLengthError'
  }
}
