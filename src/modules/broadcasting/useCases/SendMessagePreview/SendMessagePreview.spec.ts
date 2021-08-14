import { MailLogProvider } from '@infra/providers/implementations/mail/MailLogProvider'
import { IMailProvider } from '@infra/providers/models/IMailProvider'
import { Body } from '@modules/broadcasting/domain/message/body'
import { Message } from '@modules/broadcasting/domain/message/message'
import { Subject } from '@modules/broadcasting/domain/message/subject'
import { Content } from '@modules/broadcasting/domain/template/content'
import { Template } from '@modules/broadcasting/domain/template/template'
import { Title } from '@modules/broadcasting/domain/template/title'
import { InMemoryMessagesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryMessageTagsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessageTagsRepository'
import { InMemoryTemplatesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryTemplatesRepository'
import { Email } from '@modules/senders/domain/sender/email'
import { Name } from '@modules/senders/domain/sender/name'
import { Sender } from '@modules/senders/domain/sender/sender'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { SendMessagePreview } from './SendMessagePreview'

let mailProvider: IMailProvider
let sendersRepository: InMemorySendersRepository
let messageTagsRepository: InMemoryMessageTagsRepository
let templatesRepository: InMemoryTemplatesRepository
let messagesRepository: InMemoryMessagesRepository
let sendMessagePreview: SendMessagePreview

const sendEmailMock = jest.fn()

jest.mock('@infra/providers/implementations/mail/MailLogProvider', () => {
  return {
    MailLogProvider: jest.fn().mockImplementation(() => {
      return {
        sendEmail: sendEmailMock,
      }
    }),
  }
})

describe('Send Message Preview', () => {
  beforeEach(() => {
    mailProvider = new MailLogProvider()

    sendersRepository = new InMemorySendersRepository()
    messageTagsRepository = new InMemoryMessageTagsRepository()
    templatesRepository = new InMemoryTemplatesRepository()
    messagesRepository = new InMemoryMessagesRepository(
      messageTagsRepository,
      templatesRepository,
      sendersRepository
    )

    sendMessagePreview = new SendMessagePreview(
      messagesRepository,
      mailProvider
    )
  })

  it('should be able to deliver message to recipient', async () => {
    const template = Template.create({
      title: Title.create('My new template').value as Title,
      content: Content.create(
        'Custom template with {{ message_content }} variable.'
      ).value as Content,
    }).value as Template

    await templatesRepository.create(template)

    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const message = Message.create({
      subject: Subject.create('Message subject').value as Subject,
      body: Body.create('Message body with long enough content').value as Body,
      templateId: template.id,
      senderId: sender.id,
    }).value as Message

    await messagesRepository.create(message)

    await sendMessagePreview.execute({
      messageId: message.id,
      email: 'johndoe@example.com',
    })

    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: {
          email: 'johndoe@example.com',
        },
        body: 'Custom template with Message body with long enough content variable.',
      })
    )
  })
})
