import { InMemoryMessageTagsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessageTagsRepository'
import { Email } from '@modules/senders/domain/sender/email'
import { Name } from '@modules/senders/domain/sender/name'
import { Sender } from '@modules/senders/domain/sender/sender'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'
import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title as TagTitle } from '@modules/subscriptions/domain/tag/title'
import { InMemoryTagsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryTagsRepository'
import { ITagsRepository } from '@modules/subscriptions/repositories/ITagsRepository'

import { Content } from '../../domain/template/content'
import { Template } from '../../domain/template/template'
import { Title } from '../../domain/template/title'
import { InMemoryMessagesRepository } from '../../repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryTemplatesRepository } from '../../repositories/in-memory/InMemoryTemplatesRepository'
import { CreateMessage } from './CreateMessage'

let sendersRepository: InMemorySendersRepository
let messageTagsRepository: InMemoryMessageTagsRepository
let templatesRepository: InMemoryTemplatesRepository
let messagesRepository: InMemoryMessagesRepository
let tagsRepository: ITagsRepository
let createMessage: CreateMessage

const tagTitle = TagTitle.create('Tag 01').value as TagTitle
const tag = Tag.create({ title: tagTitle }).value as Tag

const sender = Sender.create({
  name: Name.create('John Doe').value as Name,
  email: Email.create('john.doe@example.com').value as Email,
}).value as Sender

describe('Create Message', () => {
  beforeEach(async () => {
    sendersRepository = new InMemorySendersRepository()
    messageTagsRepository = new InMemoryMessageTagsRepository()
    messagesRepository = new InMemoryMessagesRepository(
      messageTagsRepository,
      templatesRepository,
      sendersRepository
    )
    templatesRepository = new InMemoryTemplatesRepository()
    tagsRepository = new InMemoryTagsRepository()
    createMessage = new CreateMessage(messagesRepository, templatesRepository)

    await tagsRepository.create(tag)
  })

  it('should be able to create new message without template', async () => {
    const response = await createMessage.execute({
      subject: 'My new message',
      body: 'A message body with valid length',
      senderId: sender.id,
      tags: [tag.id],
    })

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0]).toEqual(
      expect.objectContaining({ id: expect.any(String) })
    )
  })

  it('should be able to create new message with valid template', async () => {
    const title = Title.create('My new template').value as Title

    const content = Content.create(
      'Custom template with {{ message_content }} variable.'
    ).value as Content

    const templateOrError = Template.create({
      title,
      content,
    })

    const template = templateOrError.value as Template

    templatesRepository.create(template)

    const response = await createMessage.execute({
      subject: 'My new message',
      body: 'A message body with valid length',
      templateId: template.id,
      senderId: sender.id,
      tags: [tag.id],
    })

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        templateId: template.id,
      })
    )
  })

  it('should not be able to create message with invalid data', async () => {
    const response = await createMessage.execute({
      subject: 'My new message',
      body: 'invalid',
      senderId: sender.id,
      tags: [tag.id],
    })

    expect(response.isLeft()).toBeTruthy()
  })

  it('should not be able to create message with invalid template', async () => {
    const response = await createMessage.execute({
      subject: 'My new message',
      body: 'A message body with valid length',
      templateId: 'invalid-template',
      senderId: sender.id,
      tags: [tag.id],
    })

    expect(response.isLeft()).toBeTruthy()
    expect(messagesRepository.items.length).toBe(0)
  })

  it('should not be able to create message without tags', async () => {
    const response = await createMessage.execute({
      subject: 'My new message',
      body: 'A message body with valid length',
      senderId: sender.id,
      tags: [],
    })

    expect(response.isLeft()).toBeTruthy()
    expect(messagesRepository.items.length).toBe(0)
  })
})
