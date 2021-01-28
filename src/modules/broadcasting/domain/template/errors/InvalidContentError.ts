import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidContentError extends Error implements DomainError {
  constructor() {
    super(
      `The content must include the {{ message_content }} template variable.`
    )
    this.name = 'InvalidContentError'
  }
}
