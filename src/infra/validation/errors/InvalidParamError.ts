export class InvalidParamError extends Error {
  constructor(param: string) {
    super(`The received value for field "${param}" is invalid.`)
    this.name = 'InvalidParamError'
  }
}
