import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'

import { Tag } from '../tag/tag'
import { Email } from './email'
import { InvalidEmailError } from './errors/InvalidEmailError'
import { InvalidNameError } from './errors/InvalidNameError'
import { Name } from './name'

interface IContactProps {
  name: Name
  email: Email
  tags?: Tag[]
  createdAt?: Date
}

export class Contact extends Entity<IContactProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get tags() {
    return this.props.tags
  }

  get createdAt() {
    return this.props.createdAt
  }

  private constructor(props: IContactProps, id?: string) {
    super(props, id)
  }

  public subscribeToTag(tag: Tag) {
    this.tags.push(tag)
  }

  public unsubscribeFromTag(tag: Tag) {
    const tagIndex = this.tags.findIndex(findTag => findTag.id !== tag.id)

    this.tags.splice(tagIndex, 1)
  }

  static create(
    props: IContactProps,
    id?: string
  ): Either<InvalidNameError | InvalidEmailError, Contact> {
    const contact = new Contact(
      {
        ...props,
        tags: props.tags ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return right(contact)
  }
}
