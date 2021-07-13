import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class NotSubscribedError extends Error implements UseCaseError {
  constructor() {
    super(`Contact is not subscribed to this tag.`)
    this.name = 'NotSubscribedError'
  }
}
