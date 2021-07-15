import { Either, left, right } from '@core/logic/Either'
import { ISendersRepository } from '@modules/senders/repositories/ISendersRepository'

import { InvalidSenderError } from './errors/InvalidSenderError'

type SetDefaultSenderRequest = {
  senderId: string
}

type SetDefaultSenderResponse = Either<InvalidSenderError, null>

export class SetDefaultSender {
  constructor(private sendersRepository: ISendersRepository) {}

  async execute({
    senderId,
  }: SetDefaultSenderRequest): Promise<SetDefaultSenderResponse> {
    const sender = await this.sendersRepository.findById(senderId)

    if (!sender) {
      return left(new InvalidSenderError())
    }

    const currentDefaultSender =
      await this.sendersRepository.findDefaultSender()

    if (currentDefaultSender) {
      currentDefaultSender.unsetAsDefault()

      await this.sendersRepository.save(currentDefaultSender)
    }

    sender.setAsDefault()

    await this.sendersRepository.save(sender)

    return right(null)
  }
}
