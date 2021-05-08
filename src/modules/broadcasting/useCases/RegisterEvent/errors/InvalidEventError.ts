import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class InvalidEventError extends Error implements UseCaseError {
  constructor() {
    super(`Event data is invalid.`)
    this.name = 'InvalidEventError'
  }
}
