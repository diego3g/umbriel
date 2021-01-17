import { UseCaseError } from '../../../../core/errors/UseCaseError'

export class InvalidTemplateError extends Error implements UseCaseError {
  constructor() {
    super(`Template does not exists.`)
    this.name = 'InvalidTemplateError'
  }
}
