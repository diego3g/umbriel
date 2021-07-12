import { Either, right } from '@core/logic/Either'
import { ISendersRepository } from '@modules/senders/repositories/ISendersRepository'

type RemoveSenderRequest = {
  senderId: string
}

type RemoveSenderResponse = Either<Error, null>

export class RemoveSender {
  constructor(private sendersRepository: ISendersRepository) {}

  async execute({
    senderId,
  }: RemoveSenderRequest): Promise<RemoveSenderResponse> {
    await this.sendersRepository.delete(senderId)

    return right(null)
  }
}
