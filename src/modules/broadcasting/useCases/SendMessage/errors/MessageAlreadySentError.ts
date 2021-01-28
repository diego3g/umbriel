import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class MessageAlreadySentError extends Error implements UseCaseError {
  constructor() {
    super(`The message has already been sent.`)
    this.name = 'MessageAlreadySentError'
  }
}
