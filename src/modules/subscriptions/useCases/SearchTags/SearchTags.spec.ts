import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title } from '@modules/subscriptions/domain/tag/title'
import { InMemoryTagsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryTagsRepository'

import { SearchTags } from './SearchTags'

let tagsRepository: InMemoryTagsRepository
let searchTags: SearchTags

describe('Search Tags', () => {
  beforeEach(async () => {
    tagsRepository = new InMemoryTagsRepository()
    searchTags = new SearchTags(tagsRepository)

    for (let i = 0; i < 20; i++) {
      const tag = Tag.create({
        title: Title.create(`tag-${i}`).value as Title,
      }).value as Tag

      await tagsRepository.create(tag)
    }
  })

  it('should be able to list tags without search', async () => {
    const response = await searchTags.execute({ query: '' })

    expect(response.data.length).toEqual(20)
    expect(response.totalCount).toEqual(20)
  })

  it('should be able to search through tags', async () => {
    const response = await searchTags.execute({ query: `g-5` })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].title).toEqual('tag-5')
  })

  it('should be able to search through tags with case-insensitive', async () => {
    const response = await searchTags.execute({ query: `G-5` })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].title).toEqual('tag-5')
  })

  it('should be able to paginate through contacts', async () => {
    let response = await searchTags.execute({ perPage: 10 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].title).toEqual('tag-0')

    response = await searchTags.execute({ perPage: 10, page: 2 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].title).toEqual('tag-10')
  })
})
