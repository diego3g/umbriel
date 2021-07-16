import { MessageStats } from '@modules/broadcasting/dtos/MessageStats'
import { IMessagesRepository } from '@modules/broadcasting/repositories/IMessagesRepository'

type GetMessageStatsRequest = {
  messageId: string
}

type GetMessageStatsResponse = MessageStats

export class GetMessageStats {
  constructor(private messagesRepository: IMessagesRepository) {}

  async execute({
    messageId,
  }: GetMessageStatsRequest): Promise<GetMessageStatsResponse> {
    const messageStats = await this.messagesRepository.getMessageStats(
      messageId
    )

    return messageStats
  }
}
