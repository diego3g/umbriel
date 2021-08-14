import { Event } from '@modules/broadcasting/domain/event/event'
import { Type } from '@modules/broadcasting/domain/event/type'
import { Body } from '@modules/broadcasting/domain/message/body'
import { Message } from '@modules/broadcasting/domain/message/message'
import { Subject } from '@modules/broadcasting/domain/message/subject'
import { Recipient } from '@modules/broadcasting/domain/recipient/recipient'
import { InMemoryMessagesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryMessageTagsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessageTagsRepository'
import { InMemoryTemplatesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryTemplatesRepository'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { GetMessageStats } from './GetMessageStats'

let messageTagsRepository: InMemoryMessageTagsRepository
let templatesRepository: InMemoryTemplatesRepository
let messagesRepository: InMemoryMessagesRepository
let sendersRepository: InMemorySendersRepository
let getMessageStats: GetMessageStats

describe('Get Message Stats', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySendersRepository()
    templatesRepository = new InMemoryTemplatesRepository()
    messageTagsRepository = new InMemoryMessageTagsRepository()
    messagesRepository = new InMemoryMessagesRepository(
      messageTagsRepository,
      templatesRepository,
      sendersRepository
    )
    getMessageStats = new GetMessageStats(messagesRepository)
  })

  it('should be able to get message stats', async () => {
    const message = Message.create({
      subject: Subject.create('Message subject').value as Subject,
      body: Body.create('Message content').value as Body,
      senderId: 'fake-sender-id',
      recipientsCount: 3,
      recipients: [
        Recipient.create({
          messageId: 'fake-message-id',
          contactId: 'fake-contact-id',
          events: [
            Event.create({
              recipientId: 'fake-recipient-id',
              type: Type.create('DELIVER').value as Type,
            }).value as Event,
            Event.create({
              recipientId: 'fake-recipient-id',
              type: Type.create('OPEN').value as Type,
            }).value as Event,
            Event.create({
              recipientId: 'fake-recipient-id',
              type: Type.create('CLICK').value as Type,
            }).value as Event,
            Event.create({
              recipientId: 'fake-recipient-id',
              type: Type.create('CLICK').value as Type,
            }).value as Event,
          ],
        }),
        Recipient.create({
          messageId: 'fake-message-id',
          contactId: 'fake-contact-id',
          events: [
            Event.create({
              recipientId: 'fake-recipient-id',
              type: Type.create('DELIVER').value as Type,
            }).value as Event,
            Event.create({
              recipientId: 'fake-recipient-id',
              type: Type.create('OPEN').value as Type,
            }).value as Event,
          ],
        }),
        Recipient.create({
          messageId: 'fake-message-id',
          contactId: 'fake-contact-id',
          events: [
            Event.create({
              recipientId: 'fake-recipient-id',
              type: Type.create('DELIVER').value as Type,
            }).value as Event,
          ],
        }),
      ],
    }).value as Message

    await messagesRepository.create(message)

    const response = await getMessageStats.execute({
      messageId: message.id,
    })

    expect(response.clickCount).toBe(1)
    expect(response.clickRate).toBe(50)
    expect(response.openRate).toBe(66.67)
    expect(response.deliverCount).toBe(3)
    expect(response.recipientsCount).toBe(3)
  })
})
