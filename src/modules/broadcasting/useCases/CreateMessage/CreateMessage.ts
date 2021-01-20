import { Either, left, right } from '../../../../core/logic/Either'
import { Tag } from '../../../subscriptions/domain/tag/tag'
import { Body } from '../../domain/message/body'
import { InvalidBodyLengthError } from '../../domain/message/errors/InvalidBodyLengthError'
import { InvalidSubjectLengthError } from '../../domain/message/errors/InvalidSubjectLengthError'
import { Message } from '../../domain/message/message'
import { Subject } from '../../domain/message/subject'
import { IMessagesRepository } from '../../repositories/IMessagesRepository'
import { ITemplatesRepository } from '../../repositories/ITemplatesRepository'
import { InvalidTemplateError } from './errors/InvalidTemplateError'

type CreateMessageRequest = {
  subject: string
  body: string
  templateId?: string
  tags: Tag[]
}

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
  }: CreateMessageRequest): Promise<CreateMessageResponse> {
    const subjectOrError = Subject.create(subject)
    const bodyOrError = Body.create(body)

    if (subjectOrError.isLeft()) {
      return left(subjectOrError.value)
    }

    if (bodyOrError.isLeft()) {
      return left(bodyOrError.value)
    }

    if (templateId) {
      const templateExists = await this.templatesRepository.findById(templateId)

      if (!templateExists) {
        return left(new InvalidTemplateError())
      }
    }

    const messageOrError = Message.create({
      subject: subjectOrError.value,
      body: bodyOrError.value,
      templateId,
      tags,
    })

    if (messageOrError.isLeft()) {
      return left(messageOrError.value)
    }

    const message = messageOrError.value

    await this.messagesRepository.create(message)

    return right(message)
  }
}
