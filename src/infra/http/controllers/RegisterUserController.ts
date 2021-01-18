import { BaseController } from '../../../core/infra/BaseController'
import { IUserCreateData } from '../../../modules/accounts/domain/user/user'
import { AccountAlreadyExistsError } from '../../../modules/accounts/useCases/RegisterUser/errors/AccountAlreadyExistsError'
import { RegisterUser } from '../../../modules/accounts/useCases/RegisterUser/RegisterUser'

export class RegisterUserController extends BaseController {
  private readonly registerUser: RegisterUser

  constructor(registerUser: RegisterUser) {
    super()

    this.registerUser = registerUser
  }

  protected async executeImpl(): Promise<any> {
    const dto = this.request.body as IUserCreateData

    try {
      const result = await this.registerUser.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case AccountAlreadyExistsError:
            return this.conflict(error.message)
          default:
            return this.fail(error.message)
        }
      } else {
        return this.created()
      }
    } catch (err) {
      return this.fail(err)
    }
  }
}
