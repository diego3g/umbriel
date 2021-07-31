import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title } from '@modules/subscriptions/domain/tag/title'
import { InMemoryTagsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryTagsRepository'

import { UpdateTagFromIntegration } from './UpdateTagFromIntegration'

let tagsRepository: InMemoryTagsRepository
let updateTagFromIntegration: UpdateTagFromIntegration

describe('Update Tag From Integration', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    updateTagFromIntegration = new UpdateTagFromIntegration(tagsRepository)
  })

  it('should be able to update tag', async () => {
    const tag = Tag.create({
      title: Title.create('Tag 01').value as Title,
      integrationId: 'tag-01',
    }).value as Tag

    tagsRepository.create(tag)

    const response = await updateTagFromIntegration.execute({
      tagIntegrationId: tag.integrationId,
      data: {
        title: 'Tag 02',
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(tagsRepository.items[0].title.value).toEqual('Tag 02')
  })

  it('should not be able to update a non existing tag', async () => {
    const response = await updateTagFromIntegration.execute({
      tagIntegrationId: 'non-existing-ag',
      data: {
        title: 'Tag 02',
      },
    })

    expect(response.isLeft()).toBeTruthy()
  })
})
