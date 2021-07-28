import { KafkaHandler } from '@core/infra/KafkaHandler'
import { UnsubscribeContactFromIntegration } from '@modules/subscriptions/useCases/UnsubscribeContactFromIntegration/UnsubscribeContactFromIntegration'

type UnsubscribeUserHandlerRequest = {
  userId: string
  teamsIds: string[]
}

export class UnsubscribeUserHandler implements KafkaHandler {
  constructor(
    private unsubscribeContactFromIntegration: UnsubscribeContactFromIntegration
  ) {}

  async handle({
    userId,
    teamsIds,
  }: UnsubscribeUserHandlerRequest): Promise<void> {
    const result = await this.unsubscribeContactFromIntegration.execute({
      contactIntegrationId: userId,
      tagIntegrationIds: teamsIds,
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
