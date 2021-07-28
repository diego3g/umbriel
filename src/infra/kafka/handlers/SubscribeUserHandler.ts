import { KafkaHandler } from '@core/infra/KafkaHandler'
import { SubscribeContactFromIntegration } from '@modules/subscriptions/useCases/SubscribeContactFromIntegration/SubscribeContactFromIntegration'

type SubscribeUserHandlerRequest = {
  user: {
    id: string
    name: string
    email: string
  }
  team: {
    id: string
    title: string
  }
}

export class SubscribeUserHandler implements KafkaHandler {
  constructor(
    private subscribeContactFromIntegration: SubscribeContactFromIntegration
  ) {}

  async handle({ user, team }: SubscribeUserHandlerRequest): Promise<void> {
    const result = await this.subscribeContactFromIntegration.execute({
      contact: {
        integrationId: user.id,
        name: user.name,
        email: user.email,
      },
      tag: {
        integrationId: team.id,
        title: team.title,
      },
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
