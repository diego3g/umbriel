import { Template } from '../../models/template/template'
import { IMessagesRepository } from '../../repositories/IMessagesRepository'
import { InMemoryMessagesRepository } from '../../repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryTemplatesRepository } from '../../repositories/in-memory/InMemoryTemplatesRepository'
import { ITemplatesRepository } from '../../repositories/ITemplatesRepository'
import { CreateMessage } from './CreateMessage'

let templatesRepository: ITemplatesRepository
let messagesRepository: IMessagesRepository
let createMessage: CreateMessage

describe('Create Message', () => {
  beforeEach(() => {
    messagesRepository = new InMemoryMessagesRepository()
    templatesRepository = new InMemoryTemplatesRepository()
    createMessage = new CreateMessage(messagesRepository, templatesRepository)
  })

  it('should be able to create new message without template', async () => {
    const response = await createMessage.execute({
      subject: 'My new message',
      body: 'A message body with valid length',
    })

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0]).toEqual(
      expect.objectContaining({ id: expect.any(String) })
    )
  })

  it('should be able to create new message with valid template', async () => {
    const templateOrError = Template.create({
      title: 'My custom template',
      content:
        'The message content with {{ message_content }} template variable.',
    })

    const template = templateOrError.value as Template

    templatesRepository.create(template)

    const response = await createMessage.execute({
      subject: 'My new message',
      body: 'A message body with valid length',
      templateId: template.id,
    })

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        templateId: template.id,
      })
    )
  })

  it('should not be able to create message with invalid template', async () => {
    const response = await createMessage.execute({
      subject: 'My new message',
      body: 'A message body with valid length',
      templateId: 'invalid-template',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(messagesRepository.items.length).toBe(0)
  })
})
