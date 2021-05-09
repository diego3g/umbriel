import { Either, left, right } from '@core/logic/Either'

import { InvalidTypeError } from './errors/InvalidTypeError'

export const validEventTypes = [
  'DELIVER',
  'OPEN',
  'CLICK',
  'BOUNCE',
  'COMPLAINT',
  'REJECT',
] as const

export type ValidEventTypes = typeof validEventTypes[number]

export class Type {
  private readonly type: ValidEventTypes

  get value(): ValidEventTypes {
    return this.type
  }

  private constructor(type: ValidEventTypes) {
    this.type = type
  }

  static validate(type: ValidEventTypes): boolean {
    if (!validEventTypes.includes(type)) {
      return false
    }

    return true
  }

  static create(type: ValidEventTypes): Either<InvalidTypeError, Type> {
    if (!this.validate(type)) {
      return left(new InvalidTypeError())
    }

    return right(new Type(type))
  }
}
