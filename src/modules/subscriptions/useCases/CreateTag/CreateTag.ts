import { Either, left, right } from '@core/logic/Either'
import { InvalidTitleLengthError } from '@modules/subscriptions/domain/tag/errors/InvalidTitleLengthError'
import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title } from '@modules/subscriptions/domain/tag/title'
import { ITagsRepository } from '@modules/subscriptions/repositories/ITagsRepository'

type CreateTagRequest = {
  title: string
}

type CreateTagResponse = Either<InvalidTitleLengthError, Tag>

export class CreateTag {
  constructor(private tagsRepository: ITagsRepository) {}

  async execute({ title }: CreateTagRequest): Promise<CreateTagResponse> {
    const titleOrError = Title.create(title)

    if (titleOrError.isLeft()) {
      return left(titleOrError.value)
    }

    const tagOrError = Tag.create({
      title: titleOrError.value,
    })

    if (tagOrError.isLeft()) {
      return left(tagOrError.value)
    }

    const tag = tagOrError.value

    await this.tagsRepository.create(tag)

    return right(tag)
  }
}
