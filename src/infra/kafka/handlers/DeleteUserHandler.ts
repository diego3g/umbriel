import { KafkaHandler } from '@core/infra/KafkaHandler'
import { DeleteContactFromIntegration } from '@modules/subscriptions/useCases/DeleteContactFromIntegration/DeleteContactFromIntegration'

type DeleteUserHandlerRequest = {
  userId: string
}

export class DeleteUserHandler implements KafkaHandler {
  constructor(
    private deleteContactFromIntegration: DeleteContactFromIntegration
  ) {}

  async handle({ userId }: DeleteUserHandlerRequest): Promise<void> {
    const result = await this.deleteContactFromIntegration.execute({
      contactIntegrationId: userId,
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
