import { InMemoryTemplatesRepository } from '../../repositories/in-memory/InMemoryTemplatesRepository'
import { CreateTemplate } from './CreateTemplate'

let templatesRepository: InMemoryTemplatesRepository
let createTemplate: CreateTemplate

describe('Create Message', () => {
  beforeEach(async () => {
    templatesRepository = new InMemoryTemplatesRepository()
    createTemplate = new CreateTemplate(templatesRepository)
  })

  it('should be able to create new template', async () => {
    const response = await createTemplate.execute({
      title: 'My new template',
      content:
        'A valid template content with {{ message_content }} template variable.',
    })

    expect(response.isRight()).toBeTruthy()
    expect(templatesRepository.items[0]).toEqual(
      expect.objectContaining({ id: expect.any(String) })
    )
  })

  it('should not be able to create new template with invalid content', async () => {
    const response = await createTemplate.execute({
      title: 'My new template',
      content: 'invalid-content',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(templatesRepository.items.length).toBe(0)
  })
})
