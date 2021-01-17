import { Either, left, right } from '../../../core/logic/Either'
import { Body } from '../../models/message/body'
import { Message } from '../../models/message/message'
import { IMessagesRepository } from '../../repositories/IMessagesRepository'
import { ITemplatesRepository } from '../../repositories/ITemplatesRepository'
import { InvalidMessageError } from './errors/InvalidMessageError'
import { InvalidTemplateError } from './errors/InvalidTemplateError'
import { MessageAlreadySentError } from './errors/MessageAlreadySentError'

type SendMessageResponse = Either<
  InvalidMessageError | InvalidTemplateError,
  Message
>

export class SendMessage {
  constructor(
    private messagesRepository: IMessagesRepository,
    private templatesRepository: ITemplatesRepository
  ) {}

  async execute(messageId: string): Promise<SendMessageResponse> {
    const message = await this.messagesRepository.findById(messageId)

    if (!message) {
      return left(new InvalidMessageError())
    }

    if (message.sentAt) {
      return left(new MessageAlreadySentError())
    }

    let messageBody = message.body

    if (message.templateId) {
      const template = await this.templatesRepository.findById(
        message.templateId
      )

      if (!template) {
        return left(new InvalidTemplateError())
      }

      const messageBodyContent = template.content.value.replace(
        '{{ message_content }}',
        message.body.value
      )

      messageBody = Body.create(messageBodyContent).value as Body
    }

    message.deliver(messageBody)

    await this.messagesRepository.save(message)

    return right(message)
  }
}
