import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { ITagsRepository } from '@modules/subscriptions/repositories/ITagsRepository'

type GetAllTagsResponse = Tag[]

export class GetAllTags {
  constructor(private tagsRepository: ITagsRepository) {}

  async execute(): Promise<GetAllTagsResponse> {
    const tags = this.tagsRepository.findAll()

    return tags
  }
}
