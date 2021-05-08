import { Either, right } from '@core/logic/Either'
import { IMailProvider } from '@infra/providers/models/IMailProvider'
import { Message } from '@modules/broadcasting/domain/message/message'
import { IDeliverMessageJob } from '@modules/broadcasting/jobs/IDeliverMessageJob'

type DeliverMessageToRecipientRequest = IDeliverMessageJob

type DeliverMessageToRecipientResponse = Either<null, Message>

export class DeliverMessageToRecipient {
  constructor(private mailProvider: IMailProvider) {}

  async execute({
    recipient,
    message,
    sender,
  }: DeliverMessageToRecipientRequest): Promise<DeliverMessageToRecipientResponse> {
    try {
      await this.mailProvider.sendEmail(
        {
          from: {
            name: sender.name,
            email: sender.email,
          },
          to: {
            name: recipient.name,
            email: recipient.email,
          },
          subject: message.subject,
          body: message.body,
        },
        {
          messageId: message.id,
          contactId: recipient.id,
        }
      )

      return right(null)
    } catch (err) {
      console.log(err)
    }
  }
}
