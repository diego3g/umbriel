import { MessageTag } from '@modules/broadcasting/domain/message/messageTag'
import { InMemoryMessageTagsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessageTagsRepository'
import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title as TagTitle } from '@modules/subscriptions/domain/tag/title'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'

import { Body } from '../../domain/message/body'
import { Message } from '../../domain/message/message'
import { Subject } from '../../domain/message/subject'
import { Recipient } from '../../domain/recipient/recipient'
import { Content } from '../../domain/template/content'
import { Template } from '../../domain/template/template'
import { Title } from '../../domain/template/title'
import { InMemoryMessagesRepository } from '../../repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryRecipientsRepository } from '../../repositories/in-memory/InMemoryRecipientsRepository'
import { InMemoryTemplatesRepository } from '../../repositories/in-memory/InMemoryTemplatesRepository'
import { InvalidMessageError } from './errors/InvalidMessageError'
import { InvalidTemplateError } from './errors/InvalidTemplateError'
import { MessageAlreadySentError } from './errors/MessageAlreadySentError'
import { SendMessage } from './SendMessage'

let messageTagsRepository: InMemoryMessageTagsRepository
let templatesRepository: InMemoryTemplatesRepository
let messagesRepository: InMemoryMessagesRepository
let contactsRepository: InMemoryContactsRepository
let recipientsRepository: InMemoryRecipientsRepository
let sendMessage: SendMessage

const subject = Subject.create('A new message').value as Subject
const body = Body.create('The long enough message body').value as Body

const tagTitle = TagTitle.create('Tag 01').value as TagTitle
const tag = Tag.create({ title: tagTitle }).value as Tag

describe('Send Message', () => {
  beforeEach(() => {
    messageTagsRepository = new InMemoryMessageTagsRepository()
    messagesRepository = new InMemoryMessagesRepository(messageTagsRepository)
    templatesRepository = new InMemoryTemplatesRepository()
    contactsRepository = new InMemoryContactsRepository()
    recipientsRepository = new InMemoryRecipientsRepository()

    sendMessage = new SendMessage(
      messagesRepository,
      messageTagsRepository,
      templatesRepository,
      contactsRepository,
      recipientsRepository
    )
  })

  it('should be able to send a message without template', async () => {
    const messageOrError = Message.create({
      subject,
      body,
    })

    const message = messageOrError.value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0].sentAt).toEqual(expect.any(Date))
  })

  it('should be able to send a message with template', async () => {
    const title = Title.create('My new template').value as Title

    const content = Content.create(
      'Custom template with {{ message_content }} variable.'
    ).value as Content

    const templateOrError = Template.create({
      title,
      content,
    })

    const template = templateOrError.value as Template

    await templatesRepository.create(template)

    const messageOrError = Message.create({
      subject,
      body,
      templateId: template.id,
    })

    const message = messageOrError.value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0].sentAt).toEqual(expect.any(Date))
    expect(messagesRepository.items[0].body.value).toEqual(
      'Custom template with The long enough message body variable.'
    )
  })

  it('should not be able to send message that does not exists', async () => {
    const response = await sendMessage.execute('invalid-message-id')

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidMessageError())
  })

  it('should not be able to send message with template that does not exists', async () => {
    const messageOrError = Message.create({
      subject,
      body,
      templateId: 'invalid-template-id',
    })

    const message = messageOrError.value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidTemplateError())
  })

  it('should not be able to send message that has already been sent', async () => {
    const messageOrError = Message.create({
      subject,
      body,
      templateId: 'invalid-template-id',
    })

    const message = messageOrError.value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    const recipient = Recipient.create({
      messageId: message.id,
      contactId: 'fake-contact-id',
    })

    message.deliver([recipient], message.body)

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new MessageAlreadySentError())
  })
})
