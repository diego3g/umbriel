import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'

import { Email } from './email'
import { InvalidEmailError } from './errors/InvalidEmailError'
import { InvalidNameError } from './errors/InvalidNameError'
import { Name } from './name'

interface ISenderProps {
  name: Name
  email: Email
  isValidated?: boolean
  isDefault?: boolean
}

export class Sender extends Entity<ISenderProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get isValidated() {
    return this.props.isValidated
  }

  get isDefault() {
    return this.props.isDefault
  }

  public unsetAsDefault() {
    this.props.isDefault = false
  }

  public setAsDefault() {
    this.props.isDefault = true
  }

  private constructor(props: ISenderProps, id?: string) {
    super(props, id)
  }

  static create(
    props: ISenderProps,
    id?: string
  ): Either<InvalidNameError | InvalidEmailError, Sender> {
    const sender = new Sender(
      {
        ...props,
        isValidated: props.isValidated || false,
        isDefault: props.isDefault || false,
      },
      id
    )

    return right(sender)
  }
}
