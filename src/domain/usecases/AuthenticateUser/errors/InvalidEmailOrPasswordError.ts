import { UseCaseError } from '../../errors/UseCaseError'

export class InvalidEmailOrPasswordError extends Error implements UseCaseError {
  constructor() {
    super(`Invalid e-mail/password combination.`)
    this.name = 'InvalidEmailOrPasswordError'
  }
}
