import { Tag as PersistenceTag } from '@prisma/client'

import { Tag } from '../domain/tag/tag'
import { Title } from '../domain/tag/title'

export class TagMapper {
  static toDomain(raw: PersistenceTag): Tag {
    const titleOrError = Title.create(raw.title)

    if (titleOrError.isLeft()) {
      throw new Error('Title value is invalid.')
    }

    const tagOrError = Tag.create(
      {
        title: titleOrError.value,
        integrationId: raw.integration_id,
      },
      raw.id
    )

    if (tagOrError.isRight()) {
      return tagOrError.value
    }

    return null
  }

  static toPersistence(tag: Tag) {
    return {
      id: tag.id,
      title: tag.title.value,
      integration_id: tag.integrationId,
    }
  }
}
