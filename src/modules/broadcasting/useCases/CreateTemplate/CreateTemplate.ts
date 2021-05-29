import { Either, left, right } from '@core/logic/Either'
import { Content } from '@modules/broadcasting/domain/template/content'
import { InvalidContentError } from '@modules/broadcasting/domain/template/errors/InvalidContentError'
import { InvalidTitleLengthError } from '@modules/broadcasting/domain/template/errors/InvalidTitleLengthError'
import { Template } from '@modules/broadcasting/domain/template/template'
import { Title } from '@modules/broadcasting/domain/template/title'

import { ITemplatesRepository } from '../../repositories/ITemplatesRepository'

type CreateTemplateRequest = {
  title: string
  content: string
}

type CreateTemplateResponse = Either<
  InvalidTitleLengthError | InvalidContentError,
  Template
>

export class CreateTemplate {
  constructor(private templatesRepository: ITemplatesRepository) {}

  async execute({
    title,
    content,
  }: CreateTemplateRequest): Promise<CreateTemplateResponse> {
    const titleOrError = Title.create(title)
    const contentOrError = Content.create(content)

    if (titleOrError.isLeft()) {
      return left(titleOrError.value)
    }

    if (contentOrError.isLeft()) {
      return left(contentOrError.value)
    }

    const templateOrError = Template.create({
      title: titleOrError.value,
      content: contentOrError.value,
    })

    if (templateOrError.isLeft()) {
      return left(templateOrError.value)
    }

    const template = templateOrError.value

    await this.templatesRepository.create(template)

    return right(template)
  }
}
