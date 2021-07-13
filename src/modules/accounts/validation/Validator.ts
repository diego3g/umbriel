import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'

export interface Validator {
  validate(data: RegisterUserControllerRequest): Error
}
