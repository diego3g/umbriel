import { DomainError } from '../../shared/errors/DomainError'

export class InvalidJWTTokenError extends Error implements DomainError {
  constructor() {
    super(`The JWT token is invalid.`)
    this.name = 'InvalidJWTTokenError'
  }
}
