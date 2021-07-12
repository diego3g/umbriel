import { Tag as PersistenceTag } from '@prisma/client'

import { Tag } from '../domain/tag/tag'
import { Title } from '../domain/tag/title'

type PersistenceRaw = PersistenceTag & {
  _count: {
    subscribers: number
  }
}

export class TagWithSubscribersMapper {
  static toDto(raw: PersistenceRaw) {
    const titleOrError = Title.create(raw.title)

    if (titleOrError.isLeft()) {
      throw new Error('Title value is invalid.')
    }

    const tagOrError = Tag.create(
      {
        title: titleOrError.value,
      },
      raw.id
    )

    if (tagOrError.isRight()) {
      const tag = tagOrError.value

      return {
        id: tag.id,
        title: tag.title.value,
        subscribersCount: raw._count.subscribers,
      }
    }

    return null
  }
}
