import { Either, left, right } from '@core/logic/Either'
import { InvalidTitleLengthError } from '@modules/subscriptions/domain/tag/errors/InvalidTitleLengthError'
import { Title } from '@modules/subscriptions/domain/tag/title'
import { ITagsRepository } from '@modules/subscriptions/repositories/ITagsRepository'

import { TagNotFoundError } from './errors/TagNotFoundError'

type UpdateTagFromIntegrationRequest = {
  tagIntegrationId: string
  data: {
    title: string
  }
}

type UpdateTagFromIntegrationResponse = Either<
  TagNotFoundError | InvalidTitleLengthError,
  null
>

export class UpdateTagFromIntegration {
  constructor(private tagsRepository: ITagsRepository) {}

  async execute({
    tagIntegrationId,
    data,
  }: UpdateTagFromIntegrationRequest): Promise<UpdateTagFromIntegrationResponse> {
    const tag = await this.tagsRepository.findByIntegrationId(tagIntegrationId)

    if (!tag) {
      return left(new TagNotFoundError())
    }

    const titleOrError = Title.create(data.title)

    if (titleOrError.isLeft()) {
      return left(new InvalidTitleLengthError())
    }

    tag.title = titleOrError.value

    await this.tagsRepository.save(tag)

    return right(null)
  }
}
