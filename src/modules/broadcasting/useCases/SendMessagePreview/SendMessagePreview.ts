import { Either, left, right } from '@core/logic/Either'
import { IMailProvider } from '@infra/providers/models/IMailProvider'
import { Content } from '@modules/broadcasting/domain/template/content'
import { InvalidContentError } from '@modules/broadcasting/domain/template/errors/InvalidContentError'
import { IMessagesRepository } from '@modules/broadcasting/repositories/IMessagesRepository'

import { InvalidMessageError } from '../SendMessage/errors/InvalidMessageError'

type SendMessagePreviewRequest = {
  messageId: string
  email: string
}

type SendMessagePreviewResponse = Either<
  InvalidMessageError | InvalidContentError,
  null
>

export class SendMessagePreview {
  constructor(
    private messagesRepository: IMessagesRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute({
    messageId,
    email,
  }: SendMessagePreviewRequest): Promise<SendMessagePreviewResponse> {
    const message = await this.messagesRepository.findByIdWithDetails(messageId)

    if (!message) {
      return left(new InvalidMessageError())
    }

    let messageBody = message.body

    if (message.template) {
      const templateContentOrError = Content.create(message.template.content)

      if (templateContentOrError.isLeft()) {
        return left(templateContentOrError.value)
      }

      const templateContent = templateContentOrError.value
      messageBody = templateContent.compose(message.body)
    }

    await this.mailProvider.sendEmail({
      from: {
        name: message.sender.name,
        email: message.sender.email,
      },
      to: { email },
      subject: message.subject,
      body: messageBody,
    })

    return right(null)
  }
}
