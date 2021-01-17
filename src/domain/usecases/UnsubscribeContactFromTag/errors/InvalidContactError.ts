import { UseCaseError } from '../../../../core/errors/UseCaseError'

export class InvalidContactError extends Error implements UseCaseError {
  constructor() {
    super(`Contact does not exists.`)
    this.name = 'InvalidContactError'
  }
}
