import { Content } from '@modules/broadcasting/domain/template/content'
import { Template } from '@modules/broadcasting/domain/template/template'
import { Title } from '@modules/broadcasting/domain/template/title'
import { InMemoryTemplatesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryTemplatesRepository'

import { GetAllTemplates } from './GetAllTemplates'

let templatesRepository: InMemoryTemplatesRepository
let getAllTemplates: GetAllTemplates

describe('Get All Templates', () => {
  beforeEach(() => {
    templatesRepository = new InMemoryTemplatesRepository()
    getAllTemplates = new GetAllTemplates(templatesRepository)
  })

  it('should be able to get all templates', async () => {
    const template1 = Template.create({
      title: Title.create('Template 01').value as Title,
      content: Content.create(
        'Valid template content with {{ message_content }} variable.'
      ).value as Content,
    }).value as Template

    const template2 = Template.create({
      title: Title.create('Template 02').value as Title,
      content: Content.create(
        'Valid template content with {{ message_content }} variable.'
      ).value as Content,
    }).value as Template

    templatesRepository.create(template1)
    templatesRepository.create(template2)

    const response = await getAllTemplates.execute()

    expect(response.length).toBe(2)
    expect(response[0].title.value).toEqual('Template 01')
    expect(response[1].title.value).toEqual('Template 02')
  })
})
