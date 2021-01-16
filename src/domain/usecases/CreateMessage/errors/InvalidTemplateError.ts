import { UseCaseError } from '../../errors/UseCaseError'

export class InvalidTemplateError extends Error implements UseCaseError {
  constructor() {
    super(`Template does not exists.`)
    this.name = 'InvalidTemplateError'
  }
}
