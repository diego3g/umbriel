import { DomainError } from '../../../../../core/errors/DomainError'

export class InvalidJWTTokenError extends Error implements DomainError {
  constructor() {
    super(`The JWT token is invalid.`)
    this.name = 'InvalidJWTTokenError'
  }
}
