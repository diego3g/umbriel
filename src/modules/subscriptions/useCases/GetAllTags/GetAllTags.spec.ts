import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title } from '@modules/subscriptions/domain/tag/title'
import { InMemoryTagsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryTagsRepository'

import { GetAllTags } from './GetAllTags'

let tagsRepository: InMemoryTagsRepository
let getAllTags: GetAllTags

describe('Get All Tags', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    getAllTags = new GetAllTags(tagsRepository)
  })

  it('should be able to get all tags', async () => {
    const tag1 = Tag.create({
      title: Title.create('Tag 01').value as Title,
    }).value as Tag

    const tag2 = Tag.create({
      title: Title.create('Tag 02').value as Title,
    }).value as Tag

    tagsRepository.create(tag1)
    tagsRepository.create(tag2)

    const response = await getAllTags.execute()

    expect(response.length).toBe(2)
    expect(response[0].title.value).toEqual('Tag 01')
    expect(response[1].title.value).toEqual('Tag 02')
  })
})
