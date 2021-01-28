import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidTypeError extends Error implements DomainError {
  constructor() {
    super(
      `The event type must be one of deliver, open, click, bounce, complaint or reject.`
    )

    this.name = 'InvalidTypeError'
  }
}
