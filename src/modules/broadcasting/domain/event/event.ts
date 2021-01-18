import { v4 as uuid } from 'uuid'

import { Either, left, right } from '../../../../core/logic/Either'
import { InvalidTypeError } from './errors/InvalidTypeError'
import { Type, ValidEventTypes } from './type'

interface IEventData {
  type: Type
  meta?: string
}

export interface IEventCreateData {
  type: ValidEventTypes
  meta?: string
}

export class Event {
  public readonly id: string
  public readonly type: Type
  public readonly meta?: string
  public readonly createdAt: Date

  private constructor({ type, meta }: IEventData, id?: string) {
    this.type = type
    this.meta = meta

    this.createdAt = new Date()

    this.id = id ?? uuid()
  }

  static create(
    eventData: IEventCreateData,
    id?: string
  ): Either<InvalidTypeError, Event> {
    const typeOrError = Type.create(eventData.type)

    if (typeOrError.isLeft()) {
      return left(typeOrError.value)
    }

    const event = new Event(
      {
        type: typeOrError.value,
        meta: eventData.meta,
      },
      id
    )

    return right(event)
  }
}
