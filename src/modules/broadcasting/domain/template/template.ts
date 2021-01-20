import { Content } from './content'
import { InvalidContentError } from './errors/InvalidContentError'
import { Either, right } from '../../../../core/logic/Either'
import { Title } from './title'
import { InvalidTitleLengthError } from './errors/InvalidTitleLengthError'
import { Entity } from '../../../../core/domain/Entity'

interface ITemplateProps {
  title: Title
  content: Content
}

export class Template extends Entity<ITemplateProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  private constructor(props: ITemplateProps, id?: string) {
    super(props, id)
  }

  static create(
    props: ITemplateProps,
    id?: string
  ): Either<InvalidTitleLengthError | InvalidContentError, Template> {
    const template = new Template(props, id)

    return right(template)
  }
}
