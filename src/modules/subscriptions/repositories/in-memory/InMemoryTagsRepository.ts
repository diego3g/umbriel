import { Tag } from '../../domain/tag/tag'
import {
  ITagsRepository,
  TagsSearchParams,
  TagsSearchResult,
} from '../ITagsRepository'

export class InMemoryTagsRepository implements ITagsRepository {
  constructor(public items: Tag[] = []) {}

  async exists(title: string): Promise<boolean> {
    return this.items.some(tag => tag.title.value === title)
  }

  async findAll(): Promise<Tag[]> {
    return this.items
  }

  async findById(id: string): Promise<Tag> {
    return this.items.find(tag => tag.id === id)
  }

  async findByIntegrationId(integrationId: string): Promise<Tag> {
    return this.items.find(tag => tag.integrationId === integrationId)
  }

  async findManyByIds(ids: string[]): Promise<Tag[]> {
    return this.items.filter(tag => ids.includes(tag.id))
  }

  async findManyByIntegrationIds(integrationIds: string[]): Promise<Tag[]> {
    return this.items.filter(tag => integrationIds.includes(tag.integrationId))
  }

  async findByTitle(title: string): Promise<Tag> {
    return this.items.find(tag => tag.title.value === title)
  }

  async save(tag: Tag): Promise<void> {
    const tagIndex = this.items.findIndex(findTag => findTag.id === tag.id)

    this.items[tagIndex] = tag
  }

  async create(tag: Tag): Promise<void> {
    this.items.push(tag)
  }

  async search({
    query,
    page,
    perPage,
  }: TagsSearchParams): Promise<TagsSearchResult> {
    let tagList = this.items

    if (query) {
      tagList = this.items.filter(tag => {
        const search = new RegExp(query, 'i')
        return search.test(tag.title.value)
      })
    }

    return {
      data: tagList.slice((page - 1) * perPage, page * perPage).map(tag => {
        return {
          id: tag.id,
          title: tag.title.value,
          subscribersCount: 0,
        }
      }),
      totalCount: tagList.length,
    }
  }
}
