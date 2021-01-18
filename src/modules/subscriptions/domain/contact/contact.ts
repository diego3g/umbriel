import { v4 as uuid } from 'uuid'

import { Name } from './name'
import { Email } from './email'
import { Tag } from '../tag/tag'
import { InvalidEmailError } from './errors/InvalidEmailError'
import { InvalidNameError } from './errors/InvalidNameError'
import { Either, left, right } from '../../../../core/logic/Either'

interface IContactData {
  name: Name
  email: Email
}

export interface IContactCreateData {
  name: string
  email: string
}

export class Contact {
  public readonly id: string
  public readonly name: Name
  public readonly email: Email
  public readonly createdAt: Date

  public tags: Tag[]

  private constructor({ name, email }: IContactData, id?: string) {
    this.name = name
    this.email = email

    this.createdAt = new Date()
    this.tags = []

    this.id = id ?? uuid()
  }

  public subscribeToTag(tag: Tag) {
    this.tags.push(tag)
  }

  public unsubscribeFromTag(tag: Tag) {
    this.tags = this.tags.filter(findTag => findTag.id !== tag.id)
  }

  static create(
    recipientData: IContactCreateData,
    id?: string
  ): Either<InvalidNameError | InvalidEmailError, Contact> {
    const nameOrError = Name.create(recipientData.name)
    const emailOrError = Email.create(recipientData.email)

    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const contact = new Contact(
      {
        name: nameOrError.value,
        email: emailOrError.value,
      },
      id
    )

    return right(contact)
  }
}
