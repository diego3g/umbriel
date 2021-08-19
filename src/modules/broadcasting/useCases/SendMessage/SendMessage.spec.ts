import { SyncQueueProvider } from '@infra/providers/implementations/queue/SyncQueueProvider'
import { MessageTag } from '@modules/broadcasting/domain/message/messageTag'
import { InMemoryMessageTagsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessageTagsRepository'
import { Email } from '@modules/senders/domain/sender/email'
import { Name } from '@modules/senders/domain/sender/name'
import { Sender } from '@modules/senders/domain/sender/sender'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'
import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email as ContactEmail } from '@modules/subscriptions/domain/contact/email'
import { Name as ContactName } from '@modules/subscriptions/domain/contact/name'
import { Subscription } from '@modules/subscriptions/domain/contact/subscription'
import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title as TagTitle } from '@modules/subscriptions/domain/tag/title'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { Body } from '../../domain/message/body'
import { Message } from '../../domain/message/message'
import { Subject } from '../../domain/message/subject'
import { Content } from '../../domain/template/content'
import { Template } from '../../domain/template/template'
import { Title } from '../../domain/template/title'
import { InMemoryMessagesRepository } from '../../repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryTemplatesRepository } from '../../repositories/in-memory/InMemoryTemplatesRepository'
import { InvalidMessageError } from './errors/InvalidMessageError'
import { InvalidTemplateError } from './errors/InvalidTemplateError'
import { MessageAlreadySentError } from './errors/MessageAlreadySentError'
import { SendMessage } from './SendMessage'

let subscriptionsRepository: InMemorySubscriptionsRepository
let messageTagsRepository: InMemoryMessageTagsRepository
let templatesRepository: InMemoryTemplatesRepository
let messagesRepository: InMemoryMessagesRepository
let contactsRepository: InMemoryContactsRepository
let sendersRepository: InMemorySendersRepository
let mailQueueProvider: SyncQueueProvider
let sendMessage: SendMessage

const subject = Subject.create('A new message').value as Subject
const body = Body.create('The long enough message body').value as Body

const tagTitle = TagTitle.create('Tag 01').value as TagTitle
const tag = Tag.create({ title: tagTitle }).value as Tag

describe('Send Message', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySendersRepository()
    messageTagsRepository = new InMemoryMessageTagsRepository()
    messagesRepository = new InMemoryMessagesRepository(
      messageTagsRepository,
      templatesRepository,
      sendersRepository
    )
    templatesRepository = new InMemoryTemplatesRepository()
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    mailQueueProvider = new SyncQueueProvider()

    sendMessage = new SendMessage(
      messagesRepository,
      messageTagsRepository,
      templatesRepository,
      contactsRepository,
      sendersRepository,
      mailQueueProvider
    )
  })

  it('should be able to send a message without template', async () => {
    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const messageOrError = Message.create({
      subject,
      body,
      senderId: sender.id,
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

    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const messageOrError = Message.create({
      subject,
      body,
      templateId: template.id,
      senderId: sender.id,
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
    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const messageOrError = Message.create({
      subject,
      body,
      templateId: 'invalid-template-id',
      senderId: sender.id,
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
    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const messageOrError = Message.create({
      subject,
      body,
      templateId: 'invalid-template-id',
      senderId: sender.id,
    })

    const message = messageOrError.value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    message.deliver(0, message.body)

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new MessageAlreadySentError())
  })

  it('should not send the message to unsubscribed contacts', async () => {
    const subscribedContact = Contact.create({
      name: ContactName.create('John Subscribed').value as ContactName,
      email: ContactEmail.create('johnsubscribed@example.com')
        .value as ContactEmail,
      isUnsubscribed: false,
    }).value as Contact

    const unsubscribedContact = Contact.create({
      name: ContactName.create('John Doe').value as ContactName,
      email: ContactEmail.create('johndoe@example.com').value as ContactEmail,
      isUnsubscribed: true,
    }).value as Contact

    subscribedContact.subscribeToTag(
      Subscription.create({
        tagId: tag.id,
        contactId: subscribedContact.id,
      })
    )

    unsubscribedContact.subscribeToTag(
      Subscription.create({
        tagId: tag.id,
        contactId: unsubscribedContact.id,
      })
    )

    await contactsRepository.create(subscribedContact)
    await contactsRepository.create(unsubscribedContact)

    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const message = Message.create({
      subject,
      body,
      senderId: sender.id,
    }).value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(mailQueueProvider.jobs).toEqual([
      expect.objectContaining({
        recipient: expect.objectContaining({
          name: 'John Subscribed',
          email: 'johnsubscribed@example.com',
        }),
      }),
    ])
  })

  it('should not send the message to blocked contacts', async () => {
    const subscribedContact = Contact.create({
      name: ContactName.create('John Subscribed').value as ContactName,
      email: ContactEmail.create('johnsubscribed@example.com')
        .value as ContactEmail,
      isBlocked: false,
    }).value as Contact

    const unsubscribedContact = Contact.create({
      name: ContactName.create('John Doe').value as ContactName,
      email: ContactEmail.create('johndoe@example.com').value as ContactEmail,
      isBlocked: true,
    }).value as Contact

    subscribedContact.subscribeToTag(
      Subscription.create({
        tagId: tag.id,
        contactId: subscribedContact.id,
      })
    )

    unsubscribedContact.subscribeToTag(
      Subscription.create({
        tagId: tag.id,
        contactId: unsubscribedContact.id,
      })
    )

    await contactsRepository.create(subscribedContact)
    await contactsRepository.create(unsubscribedContact)

    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const message = Message.create({
      subject,
      body,
      senderId: sender.id,
    }).value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(mailQueueProvider.jobs).toEqual([
      expect.objectContaining({
        recipient: expect.objectContaining({
          name: 'John Subscribed',
          email: 'johnsubscribed@example.com',
        }),
      }),
    ])
  })

  it('should not send the message to bounced contacts', async () => {
    const subscribedContact = Contact.create({
      name: ContactName.create('John Subscribed').value as ContactName,
      email: ContactEmail.create('johnsubscribed@example.com')
        .value as ContactEmail,
      isBounced: false,
    }).value as Contact

    const bouncedContact = Contact.create({
      name: ContactName.create('John Doe').value as ContactName,
      email: ContactEmail.create('johndoe@example.com').value as ContactEmail,
      isBounced: true,
    }).value as Contact

    subscribedContact.subscribeToTag(
      Subscription.create({
        tagId: tag.id,
        contactId: subscribedContact.id,
      })
    )

    bouncedContact.subscribeToTag(
      Subscription.create({
        tagId: tag.id,
        contactId: bouncedContact.id,
      })
    )

    await contactsRepository.create(subscribedContact)
    await contactsRepository.create(bouncedContact)

    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const message = Message.create({
      subject,
      body,
      senderId: sender.id,
    }).value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(mailQueueProvider.jobs).toEqual([
      expect.objectContaining({
        recipient: expect.objectContaining({
          name: 'John Subscribed',
          email: 'johnsubscribed@example.com',
        }),
      }),
    ])
  })

  it('should inline the CSS from the template', async () => {
    const title = Title.create('My new template').value as Title

    const content = Content.create(
      '<style>.message-content p { color: red; }</style><div class="message-content">{{ message_content }}</div>'
    ).value as Content

    const templateOrError = Template.create({
      title,
      content,
    })

    const template = templateOrError.value as Template

    await templatesRepository.create(template)

    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const messageOrError = Message.create({
      subject,
      body: Body.create('<p>The message body</p>').value as Body,
      templateId: template.id,
      senderId: sender.id,
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
    expect(messagesRepository.items[0].body.value).toEqual(
      '<div class="message-content"><p style="color: red;">The message body</p></div>'
    )
  })

  it('should compose the message body with the template content', async () => {
    const subscribedContact = Contact.create({
      name: ContactName.create('John Subscribed').value as ContactName,
      email: ContactEmail.create('johnsubscribed@example.com')
        .value as ContactEmail,
      isUnsubscribed: false,
    }).value as Contact

    subscribedContact.subscribeToTag(
      Subscription.create({
        tagId: tag.id,
        contactId: subscribedContact.id,
      })
    )

    await contactsRepository.create(subscribedContact)

    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const template = Template.create({
      title: Title.create('My new template').value as Title,
      content: Content.create(
        'Custom template with {{ message_content }} variable.'
      ).value as Content,
    }).value as Template

    await templatesRepository.create(template)

    const message = Message.create({
      subject,
      body,
      senderId: sender.id,
      templateId: template.id,
    }).value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(mailQueueProvider.jobs).toEqual([
      expect.objectContaining({
        recipient: expect.objectContaining({
          name: 'John Subscribed',
          email: 'johnsubscribed@example.com',
        }),
        message: expect.objectContaining({
          body: 'Custom template with The long enough message body variable.',
        }),
      }),
    ])
  })

  it('should store the recipients count when message is sent', async () => {
    const subscribedContact = Contact.create({
      name: ContactName.create('John Subscribed').value as ContactName,
      email: ContactEmail.create('johnsubscribed@example.com')
        .value as ContactEmail,
    }).value as Contact

    subscribedContact.subscribeToTag(
      Subscription.create({
        tagId: tag.id,
        contactId: subscribedContact.id,
      })
    )

    await contactsRepository.create(subscribedContact)

    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Sender

    await sendersRepository.create(sender)

    const template = Template.create({
      title: Title.create('My new template').value as Title,
      content: Content.create(
        'Custom template with {{ message_content }} variable.'
      ).value as Content,
    }).value as Template

    await templatesRepository.create(template)

    const message = Message.create({
      subject,
      body,
      senderId: sender.id,
      templateId: template.id,
    }).value as Message

    const messageTag = MessageTag.create({
      messageId: message.id,
      tagId: tag.id,
    })

    message.setTags([messageTag])

    await messagesRepository.create(message)

    const response = await sendMessage.execute(message.id)

    expect(response.isRight()).toBeTruthy()
    expect(messagesRepository.items[0].recipientsCount).toEqual(1)
  })
})
