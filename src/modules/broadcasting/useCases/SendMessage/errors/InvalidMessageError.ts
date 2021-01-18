import { UseCaseError } from '../../../../../core/errors/UseCaseError'

export class InvalidMessageError extends Error implements UseCaseError {
  constructor() {
    super(`Message does not exists.`)
    this.name = 'InvalidMessageError'
  }
}
