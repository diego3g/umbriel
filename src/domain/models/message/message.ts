import { v4 as uuid } from 'uuid'

import { Subject } from './subject'
import { Body } from './body'
import { InvalidSubjectLengthError } from './errors/InvalidSubjectLengthError'
import { InvalidBodyLengthError } from './errors/InvalidBodyLengthError'
import { Either, left, right } from '../../../core/logic/Either'
import { Recipient } from './recipient'
import { Tag } from '../tag/tag'

interface IMessageData {
  subject: Subject
  body: Body
  templateId?: string
  tags: Tag[]
}

export interface IMessageCreateData {
  subject: string
  body: string
  templateId?: string
  tags: Tag[]
}

export class Message {
  public readonly id: string
  public readonly subject: Subject
  public body: Body
  public readonly templateId?: string
  public readonly tags: Tag[]

  public sentAt: Date
  public recipients: Recipient[]

  private constructor(
    { subject, body, templateId, tags }: IMessageData,
    id?: string
  ) {
    this.subject = subject
    this.body = body
    this.templateId = templateId
    this.tags = tags

    this.id = id ?? uuid()
  }

  public deliver(recipients: Recipient[], messageBody: Body) {
    this.sentAt = new Date()
    this.recipients = recipients
    this.body = messageBody
  }

  static create(
    messageData: IMessageCreateData,
    id?: string
  ): Either<InvalidSubjectLengthError | InvalidBodyLengthError, Message> {
    const subjectOrError = Subject.create(messageData.subject)
    const bodyOrError = Body.create(messageData.body)

    if (subjectOrError.isLeft()) {
      return left(subjectOrError.value)
    }

    if (bodyOrError.isLeft()) {
      return left(bodyOrError.value)
    }

    const message = new Message(
      {
        subject: subjectOrError.value,
        body: bodyOrError.value,
        templateId: messageData.templateId,
        tags: messageData.tags,
      },
      id
    )

    return right(message)
  }
}
