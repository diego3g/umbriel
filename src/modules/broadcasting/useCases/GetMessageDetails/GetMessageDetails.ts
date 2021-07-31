import { Either, right } from '@core/logic/Either'
import { MessageWithDetails } from '@modules/broadcasting/dtos/MessageWithDetails'
import { IMessagesRepository } from '@modules/broadcasting/repositories/IMessagesRepository'

type GetMessageDetailsRequest = {
  messageId: string
}

type GetMessageDetailsResponse = Either<Error, MessageWithDetails>

export class GetMessageDetails {
  constructor(private messagesRepository: IMessagesRepository) {}

  async execute({
    messageId,
  }: GetMessageDetailsRequest): Promise<GetMessageDetailsResponse> {
    const messageWithDetails =
      await this.messagesRepository.findByIdWithDetails(messageId)

    return right(messageWithDetails)
  }
}
