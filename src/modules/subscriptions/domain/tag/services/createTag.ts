import { Either, left } from '@core/logic/Either'

import { InvalidTitleLengthError } from '../errors/InvalidTitleLengthError'
import { Tag } from '../tag'
import { Title } from '../title'

type CreateTagRequest = {
  title: string
}

type CreateTagResponse = Either<InvalidTitleLengthError, Tag>

export function createTag({ title }: CreateTagRequest): CreateTagResponse {
  const titleOrError = Title.create(title)

  if (titleOrError.isLeft()) {
    return left(titleOrError.value)
  }

  const tagOrError = Tag.create({
    title: titleOrError.value,
  })

  return tagOrError
}
