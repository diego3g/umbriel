import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class EmptyTagsError extends Error implements UseCaseError {
  constructor() {
    super(`Can't create a message without tags.`)
    this.name = 'EmptyTagsError'
  }
}
