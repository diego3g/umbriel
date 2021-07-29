import { KafkaHandler } from '@core/infra/KafkaHandler'
import { UpdateContactFromIntegration } from '@modules/subscriptions/useCases/UpdateContactFromIntegration/UpdateContactFromIntegration'

type UpdateUserInfoHandlerRequest = {
  user: {
    id: string
    name: string
    email: string
  }
}

export class UpdateUserInfoHandler implements KafkaHandler {
  constructor(
    private updateContactFromIntegration: UpdateContactFromIntegration
  ) {}

  async handle({ user }: UpdateUserInfoHandlerRequest): Promise<void> {
    const result = await this.updateContactFromIntegration.execute({
      contactIntegrationId: user.id,
      data: {
        name: user.name,
        email: user.email,
      },
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
