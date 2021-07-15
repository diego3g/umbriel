import { Content } from '@modules/broadcasting/domain/template/content'
import { Template } from '@modules/broadcasting/domain/template/template'
import { Title } from '@modules/broadcasting/domain/template/title'
import { InMemoryTemplatesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryTemplatesRepository'

import { SetDefaultTemplate } from './SetDefaultTemplate'

let templatesRepository: InMemoryTemplatesRepository
let setDefaultTemplate: SetDefaultTemplate

describe('Set Default Template', () => {
  beforeEach(() => {
    templatesRepository = new InMemoryTemplatesRepository()
    setDefaultTemplate = new SetDefaultTemplate(templatesRepository)
  })

  it('should be able to set default template', async () => {
    const defaultTemplate = Template.create({
      title: Title.create('Default template').value as Title,
      content: Content.create(
        'Template content with {{ message_content }} variable.'
      ).value as Content,
      isDefault: true,
    }).value as Template

    const notDefaultTemplate = Template.create({
      title: Title.create('Not default template').value as Title,
      content: Content.create(
        'Template content with {{ message_content }} variable.'
      ).value as Content,
      isDefault: false,
    }).value as Template

    await templatesRepository.create(defaultTemplate)
    await templatesRepository.create(notDefaultTemplate)

    const response = await setDefaultTemplate.execute({
      templateId: notDefaultTemplate.id,
    })

    const updatedDefaultTemplate = await templatesRepository.findById(
      defaultTemplate.id
    )

    const updatedNotDefaultTemplate = await templatesRepository.findById(
      notDefaultTemplate.id
    )

    const currentDefaultTemplate =
      await templatesRepository.findDefaultTemplate()

    expect(response.isRight()).toBeTruthy()
    expect(updatedDefaultTemplate.isDefault).toBe(false)
    expect(updatedNotDefaultTemplate.isDefault).toBe(true)
    expect(currentDefaultTemplate.id).toEqual(notDefaultTemplate.id)
  })
})
