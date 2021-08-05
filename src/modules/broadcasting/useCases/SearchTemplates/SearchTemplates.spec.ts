import { Content } from '@modules/broadcasting/domain/template/content'
import { Template } from '@modules/broadcasting/domain/template/template'
import { Title } from '@modules/broadcasting/domain/template/title'
import { InMemoryTemplatesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryTemplatesRepository'

import { SearchTemplates } from './SearchTemplates'

let templatesRepository: InMemoryTemplatesRepository
let searchTemplates: SearchTemplates

describe('Search Templates', () => {
  beforeEach(async () => {
    templatesRepository = new InMemoryTemplatesRepository()
    searchTemplates = new SearchTemplates(templatesRepository)

    for (let i = 0; i < 20; i++) {
      const template = Template.create({
        title: Title.create(`template-${i}`).value as Title,
        content: Content.create(
          'Template content with {{ meessage_content }} variable.'
        ).value as Content,
      }).value as Template

      await templatesRepository.create(template)
    }
  })

  it('should be able to list templates without search', async () => {
    const response = await searchTemplates.execute({ query: '' })

    expect(response.data.length).toEqual(20)
    expect(response.totalCount).toEqual(20)
  })

  it('should be able to search through templates', async () => {
    const response = await searchTemplates.execute({ query: `plate-5` })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].title.value).toEqual('template-5')
  })
  it('should be able to search through templates with case-insensitive', async () => {
    const response = await searchTemplates.execute({ query: `pLaTe-5` })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].title.value).toEqual('template-5')
  })

  it('should be able to paginate through templates', async () => {
    let response = await searchTemplates.execute({ perPage: 10 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].title.value).toEqual('template-0')

    response = await searchTemplates.execute({ perPage: 10, page: 2 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].title.value).toEqual('template-10')
  })
})
