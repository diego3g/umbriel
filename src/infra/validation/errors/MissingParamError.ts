export class MissingParamError extends Error {
  constructor(param: string) {
    super(`The "${param}" parameter is missing in request body.`)
    this.name = 'MissingParamError'
  }
}
