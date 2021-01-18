import { Either, left, right } from '../../../../core/logic/Either'
import { InvalidBodyLengthError } from '../../domain/message/errors/InvalidBodyLengthError'
import { InvalidSubjectLengthError } from '../../domain/message/errors/InvalidSubjectLengthError'
import { IMessageCreateData, Message } from '../../domain/message/message'
import { IMessagesRepository } from '../../repositories/IMessagesRepository'
import { ITemplatesRepository } from '../../repositories/ITemplatesRepository'
import { InvalidTemplateError } from './errors/InvalidTemplateError'

type CreateMessageResponse = Either<
  InvalidSubjectLengthError | InvalidBodyLengthError | InvalidTemplateError,
  Message
>

export class CreateMessage {
  constructor(
    private messagesRepository: IMessagesRepository,
    private templatesRepository: ITemplatesRepository
  ) {}

  async execute({
    body,
    subject,
    templateId,
    tags,
  }: IMessageCreateData): Promise<CreateMessageResponse> {
    if (templateId) {
      const templateExists = await this.templatesRepository.findById(templateId)

      if (!templateExists) {
        return left(new InvalidTemplateError())
      }
    }

    const messageOrError = Message.create({ body, subject, templateId, tags })

    if (messageOrError.isLeft()) {
      return left(messageOrError.value)
    }

    const message = messageOrError.value

    await this.messagesRepository.create(message)

    return right(message)
  }
}
