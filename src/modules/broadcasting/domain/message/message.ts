import { Subject } from './subject'
import { Body } from './body'
import { InvalidSubjectLengthError } from './errors/InvalidSubjectLengthError'
import { InvalidBodyLengthError } from './errors/InvalidBodyLengthError'
import { Either, right } from '../../../../core/logic/Either'
import { Recipient } from './recipient'
import { Tag } from '../../../subscriptions/domain/tag/tag'
import { Entity } from '../../../../core/domain/Entity'

interface IMessageProps {
  subject: Subject
  body: Body
  templateId?: string
  tags?: Tag[]
  sentAt?: Date
  recipients?: Recipient[]
}

export class Message extends Entity<IMessageProps> {
  // public subject: Subject
  // public body: Body
  // public templateId?: string
  // public tags: Tag[]

  // public sentAt: Date
  // public recipients: Recipient[]

  get subject() {
    return this.props.subject
  }

  get body() {
    return this.props.body
  }

  get templateId() {
    return this.props.templateId
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

  public deliver(recipients: Recipient[], messageBody: Body) {
    this.props.sentAt = new Date()
    this.props.recipients = recipients
    this.props.body = messageBody
  }

  static create(
    props: IMessageProps,
    id?: string
  ): Either<InvalidSubjectLengthError | InvalidBodyLengthError, Message> {
    // const subjectOrError = Subject.create(messageData.subject)
    // const bodyOrError = Body.create(messageData.body)

    // if (subjectOrError.isLeft()) {
    //   return left(subjectOrError.value)
    // }

    // if (bodyOrError.isLeft()) {
    //   return left(bodyOrError.value)
    // }

    const message = new Message(props, id)

    return right(message)
  }
}
