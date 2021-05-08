import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'

import { InvalidTypeError } from './errors/InvalidTypeError'
import { Type } from './type'

interface IEventProps {
  type: Type
  recipientId: string
  meta?: any
}

export class Event extends Entity<IEventProps> {
  get type() {
    return this.props.type
  }

  get recipientId() {
    return this.props.recipientId
  }

  get meta() {
    return this.props.meta
  }

  private constructor(props: IEventProps, id?: string) {
    super(props, id)
  }

  static create(
    props: IEventProps,
    id?: string
  ): Either<InvalidTypeError, Event> {
    const event = new Event(props, id)

    return right(event)
  }
}
