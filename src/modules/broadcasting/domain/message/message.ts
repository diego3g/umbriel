import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'

import { Recipient } from '../recipient/recipient'
import { Body } from './body'
import { InvalidBodyLengthError } from './errors/InvalidBodyLengthError'
import { InvalidSubjectLengthError } from './errors/InvalidSubjectLengthError'
import { MessageTag } from './messageTag'
import { MessageTags } from './messageTags'
import { Subject } from './subject'

interface IMessageProps {
  subject: Subject
  body: Body
  templateId?: string
  senderId: string
  tags?: MessageTags
  sentAt?: Date
  recipients?: Recipient[]
}

export class Message extends Entity<IMessageProps> {
  get subject() {
    return this.props.subject
  }

  get body() {
    return this.props.body
  }

  get templateId() {
    return this.props.templateId
  }

  get senderId() {
    return this.props.senderId
  }

  get tags() {
    return this.props.tags
  }

  get sentAt() {
    return this.props.sentAt
  }

  get recipients() {
    return this.props.recipients
  }

  private constructor(props: IMessageProps, id?: string) {
    super(props, id)
  }

  public setTags(tags: MessageTag[]) {
    this.props.tags = MessageTags.create(tags)
  }

  public deliver(recipients: Recipient[], messageBody: Body) {
    this.props.sentAt = new Date()
    this.props.recipients = recipients
    this.props.body = messageBody
  }

  static create(
    props: IMessageProps,
    id?: string
  ): Either<InvalidSubjectLengthError | InvalidBodyLengthError, Message> {
    const message = new Message(
      {
        ...props,
        tags: props.tags ?? MessageTags.create([]),
      },
      id
    )

    return right(message)
  }
}
