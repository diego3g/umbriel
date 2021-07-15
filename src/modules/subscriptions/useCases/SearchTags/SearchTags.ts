import { TagWithSubscribersCount } from '@modules/subscriptions/dtos/TagWithSubscribersCount'
import { ITagsRepository } from '@modules/subscriptions/repositories/ITagsRepository'

type SearchTagsRequest = {
  query?: string
  page?: number
  perPage?: number
}

type SearchTagsResponse = {
  data: TagWithSubscribersCount[]
  totalCount: number
}

export class SearchTags {
  constructor(private tagsRepository: ITagsRepository) {}

  async execute({
    query,
    page = 1,
    perPage = 20,
  }: SearchTagsRequest): Promise<SearchTagsResponse> {
    const { data, totalCount } = await this.tagsRepository.search({
      query,
      page,
      perPage,
    })

    return { data, totalCount }
  }
}
