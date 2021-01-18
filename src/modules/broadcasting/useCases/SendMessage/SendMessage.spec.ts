import { Message } from '../../domain/message/message'
import { Template } from '../../domain/template/template'
import { IContactsRepository } from '../../../subscriptions/repositories/IContactsRepository'
import { IMessagesRepository } from '../../repositories/IMessagesRepository'
import { InMemoryMessagesRepository } from '../../repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryTemplatesRepository } from '../../repositories/in-memory/InMemoryTemplatesRepository'
import { InMemoryContactsRepository } from '../../../subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemoryRecipientsRepository } from '../../repositories/in-memory/InMemoryRecipientsRepository'
import { IRecipientsRepository } from '../../repositories/IRecipientsRepository'
import { ITemplatesRepository } from '../../repositories/ITemplatesRepository'
import { InvalidMessageError } from './errors/InvalidMessageError'
import { InvalidTemplateError } from './errors/InvalidTemplateError'
import { MessageAlreadySentError } from './errors/MessageAlreadySentError'
import { SendMessage } from './SendMessage'
import { Tag } from '../../../subscriptions/domain/tag/tag'
import { Recipient } from '../../domain/message/recipient'

let templatesRepository: ITemplatesRepository
let messagesRepository: IMessagesRepository
let contactsRepository: IContactsRepository
let recipientsRepository: IRecipientsRepository
let sendMessage: SendMessage

describe('Send Message', () => {
  beforeEach(() => {
    messagesRepository = new InMemoryMessagesRepository()
    templatesRepository = new InMemoryTemplatesRepository()
    contactsRepository = new InMemoryContactsRepository()
    recipientsRepository = new InMemoryRecipientsRepository()

    sendMessage = new SendMessage(
      messagesRepository,
      templatesRepository,
      contactsRepository,
      recipientsRepository
    )
  })

  it('should be able to send a message without template', async () => {
    const tagOrError = Tag.create({
      title: 'Students',
    })

    const tag = tagOrError.value as Tag

    const messageOrError = Message.create({
      subject: 'My new message',
      body: 'A message body with valid length',
      tags: [tag],
    })

    const message = messageOrError.value as Message

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0].sentAt).toEqual(expect.any(Date))
  })

  it('should be able to send a message with template', async () => {
    const templateOrError = Template.create({
      title: 'My new template',
      content: 'Custom template with {{ message_content }} variable.',
    })

    const template = templateOrError.value as Template

    await templatesRepository.create(template)

    const tagOrError = Tag.create({
      title: 'Students',
    })

    const tag = tagOrError.value as Tag

    const messageOrError = Message.create({
      subject: 'My new message',
      body: 'A message body with valid length',
      templateId: template.id,
      tags: [tag],
    })

    const message = messageOrError.value as Message

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0].sentAt).toEqual(expect.any(Date))
    expect(messagesRepository.items[0].body.value).toEqual(
      'Custom template with A message body with valid length variable.'
    )
  })

  it('should not be able to send message that does not exists', async () => {
    const response = await sendMessage.execute('invalid-message-id')

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidMessageError())
  })

  it('should not be able to send message with template that does not exists', async () => {
    const tagOrError = Tag.create({
      title: 'Students',
    })

    const tag = tagOrError.value as Tag

    const messageOrError = Message.create({
      subject: 'My new message',
      body: 'A message body with valid length',
      templateId: 'invalid-template-id',
      tags: [tag],
    })

    const message = messageOrError.value as Message

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidTemplateError())
  })

  it('should not be able to send message that has already been sent', async () => {
    const tagOrError = Tag.create({
      title: 'Students',
    })

    const tag = tagOrError.value as Tag

    const messageOrError = Message.create({
      subject: 'My new message',
      body: 'A message body with valid length',
      templateId: 'invalid-template-id',
      tags: [tag],
    })

    const message = messageOrError.value as Message

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
