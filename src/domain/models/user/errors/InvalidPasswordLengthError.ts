import { DomainError } from '../../shared/errors/DomainError'

export class InvalidPasswordLengthError extends Error implements DomainError {
  constructor() {
    super(`The password must have between 6 and 255 characters.`)
    this.name = 'InvalidPasswordLengthError'
  }
}
