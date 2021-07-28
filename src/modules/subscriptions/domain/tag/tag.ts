import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'

import { InvalidTitleLengthError } from './errors/InvalidTitleLengthError'
import { Title } from './title'

interface ITagProps {
  title: Title
  integrationId?: string
}

export class Tag extends Entity<ITagProps> {
  get title() {
    return this.props.title
  }

  get integrationId() {
    return this.props.integrationId
  }

  public setIntegrationId(integrationId: string) {
    this.props.integrationId = integrationId
  }

  private constructor(props: ITagProps, id?: string) {
    super(props, id)
  }

  static create(
    props: ITagProps,
    id?: string
  ): Either<InvalidTitleLengthError, Tag> {
    const tag = new Tag(props, id)

    return right(tag)
  }
}
