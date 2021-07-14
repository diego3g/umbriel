import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class ContactNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Contact does not exists.`)
    this.name = 'ContactNotFoundError'
  }
}
