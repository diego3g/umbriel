import { Tag } from '../domain/tag/tag'
import { TagWithSubscribersCount } from '../dtos/TagWithSubscribersCount'

export type TagsSearchParams = {
  query?: string
  page: number
  perPage: number
}

export type TagsSearchResult = {
  data: TagWithSubscribersCount[]
  totalCount: number
}

export interface ITagsRepository {
  exists(title: string): Promise<boolean>
  findAll(): Promise<Tag[]>
  findById(id: string): Promise<Tag>
  findByIntegrationId(integrationId: string): Promise<Tag>
  findManyByIds(ids: string[]): Promise<Tag[]>
  findManyByIntegrationIds(integrationIds: string[]): Promise<Tag[]>
  findByTitle(title: string): Promise<Tag>
  save(tag: Tag): Promise<void>
  create(tag: Tag): Promise<void>
  search(params: TagsSearchParams): Promise<TagsSearchResult>
}
