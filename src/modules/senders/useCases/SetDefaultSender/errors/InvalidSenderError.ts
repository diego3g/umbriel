import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class InvalidSenderError extends Error implements UseCaseError {
  constructor() {
    super(`Sender does not exists.`)
    this.name = 'InvalidSenderError'
  }
}
