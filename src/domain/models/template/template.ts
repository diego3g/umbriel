import { v4 as uuid } from 'uuid'

import { Either, left, right } from '../../../core/logic/Either'
import { Content } from './content'
import { Title } from './title'
import { InvalidTitleLengthError } from './errors/InvalidTitleLengthError'
import { InvalidContentError } from './errors/InvalidContentError'

interface ITemplateData {
  title: Title
  content: Content
}

export interface ITemplateCreateData {
  title: string
  content: string
}

export class Template {
  public readonly id: string
  public readonly title: Title
  public readonly content: Content

  private constructor({ title, content }: ITemplateData, id?: string) {
    this.title = title
    this.content = content

    this.id = id ?? uuid()
  }

  static create(
    templateData: ITemplateCreateData,
    id?: string
  ): Either<InvalidTitleLengthError | InvalidContentError, Template> {
    const titleOrError = Title.create(templateData.title)
    const contentOrError = Content.create(templateData.content)

    if (titleOrError.isLeft()) {
      return left(titleOrError.value)
    }

    if (contentOrError.isLeft()) {
      return left(contentOrError.value)
    }

    const template = new Template(
      {
        title: titleOrError.value,
        content: contentOrError.value,
      },
      id
    )

    return right(template)
  }
}
