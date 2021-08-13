import { Sender } from '@modules/senders/domain/sender/sender'
import { ISendersRepository } from '@modules/senders/repositories/ISendersRepository'

type GetAllSendersResponse = Sender[]

export class GetAllSenders {
  constructor(private sendersRepository: ISendersRepository) {}

  async execute(): Promise<GetAllSendersResponse> {
    const senders = await this.sendersRepository.findAll()

    return senders
  }
}
