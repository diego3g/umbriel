import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class AccountAlreadyExistsError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`The email "${email}" is already registered.`)
    this.name = 'AccountAlreadyExistsError'
  }
}
