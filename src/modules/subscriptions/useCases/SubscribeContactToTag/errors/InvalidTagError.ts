import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class InvalidTagError extends Error implements UseCaseError {
  constructor() {
    super(`Tag does not exists.`)
    this.name = 'InvalidTagError'
  }
}
