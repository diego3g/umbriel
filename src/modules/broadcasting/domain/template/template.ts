import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'

import { Content } from './content'
import { InvalidContentError } from './errors/InvalidContentError'
import { InvalidTitleLengthError } from './errors/InvalidTitleLengthError'
import { Title } from './title'

interface ITemplateProps {
  title: Title
  content: Content
  isDefault?: boolean
}

export class Template extends Entity<ITemplateProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
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

  private constructor(props: ITemplateProps, id?: string) {
    super(props, id)
  }

  static create(
    props: ITemplateProps,
    id?: string
  ): Either<InvalidTitleLengthError | InvalidContentError, Template> {
    const template = new Template(
      {
        ...props,
        isDefault: props.isDefault ?? false,
      },
      id
    )

    return right(template)
  }
}
