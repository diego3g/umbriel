import { InMemoryTagsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryTagsRepository'

import { CreateTag } from './CreateTag'

let tagsRepository: InMemoryTagsRepository
let createTag: CreateTag

describe('Create Tag', () => {
  beforeEach(async () => {
    tagsRepository = new InMemoryTagsRepository()
    createTag = new CreateTag(tagsRepository)
  })

  it('should be able to create a new tag', async () => {
    const response = await createTag.execute({
      title: 'My tag title',
    })

    expect(response.isRight()).toBe(true)
    expect(tagsRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    )
  })

  it('should not be able to create a tag with invalid title', async () => {
    const response = await createTag.execute({
      title: '',
    })

    expect(response.isLeft()).toBe(true)
    expect(tagsRepository.items.length).toBe(0)
  })
})
