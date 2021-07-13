import { Tag } from '@prisma/client'

import { TagWithSubscribersCount } from '../dtos/TagWithSubscribersCount'

type PersistenceRaw = Tag & {
  _count: {
    subscribers: number
  }
}

export class TagWithSubscribersMapper {
  static toDto(raw: PersistenceRaw): TagWithSubscribersCount {
    return {
      id: raw.id,
      title: raw.title,
      subscribersCount: raw._count.subscribers,
    }
  }
}
