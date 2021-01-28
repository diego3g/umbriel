import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidJWTTokenError extends Error implements DomainError {
  constructor() {
    super(`The JWT token is invalid.`)
    this.name = 'InvalidJWTTokenError'
  }
}
