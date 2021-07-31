import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class TagNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Tag does not exists.`)
    this.name = 'TagNotFoundError'
  }
}
