import { UseCaseError } from '../../../../../core/errors/UseCaseError'

export class InvalidEmailOrPasswordError extends Error implements UseCaseError {
  constructor() {
    super(`Invalid e-mail/password combination.`)
    this.name = 'InvalidEmailOrPasswordError'
  }
}
