import { Either, left, right } from '@core/logic/Either'
import { MessageTag } from '@modules/broadcasting/domain/message/messageTag'

import { Body } from '../../domain/message/body'
import { InvalidBodyLengthError } from '../../domain/message/errors/InvalidBodyLengthError'
import { InvalidSubjectLengthError } from '../../domain/message/errors/InvalidSubjectLengthError'
import { Message } from '../../domain/message/message'
import { Subject } from '../../domain/message/subject'
import { IMessagesRepository } from '../../repositories/IMessagesRepository'
import { ITemplatesRepository } from '../../repositories/ITemplatesRepository'
import { EmptyTagsError } from './errors/EmptyTagsError'
import { InvalidTemplateError } from './errors/InvalidTemplateError'

type CreateMessageRequest = {
  subject: string
  body: string
  templateId?: string
  senderId: string
  tags: string[]
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
    senderId,
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

    if (tags.length === 0) {
      return left(new EmptyTagsError())
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
      senderId,
      templateId,
    })

    if (messageOrError.isLeft()) {
      return left(messageOrError.value)
    }

    const message = messageOrError.value

    const messageTags = tags.map(tagId => {
      return MessageTag.create({
        tagId,
        messageId: message.id,
      })
    })

    message.setTags(messageTags)

    await this.messagesRepository.create(message)

    return right(message)
  }
}
