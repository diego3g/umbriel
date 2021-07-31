import { KafkaHandler } from '@core/infra/KafkaHandler'
import { UpdateTagFromIntegration } from '@modules/subscriptions/useCases/UpdateTagFromIntegration/UpdateTagFromIntegration'

type UpdateTeamTitleHandlerRequest = {
  team: {
    id: string
    title: string
  }
}

export class UpdateTeamTitleHandler implements KafkaHandler {
  constructor(private updateTagFromIntegration: UpdateTagFromIntegration) {}

  async handle({ team }: UpdateTeamTitleHandlerRequest): Promise<void> {
    const result = await this.updateTagFromIntegration.execute({
      tagIntegrationId: team.id,
      data: {
        title: team.title,
      },
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
