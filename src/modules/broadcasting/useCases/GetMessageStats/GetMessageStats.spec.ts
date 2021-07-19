import { Event } from '@modules/broadcasting/domain/event/event'
import { Type } from '@modules/broadcasting/domain/event/type'
import { Body } from '@modules/broadcasting/domain/message/body'
import { Message } from '@modules/broadcasting/domain/message/message'
import { Subject } from '@modules/broadcasting/domain/message/subject'
import { Recipient } from '@modules/broadcasting/domain/recipient/recipient'
import { InMemoryMessagesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryMessageTagsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessageTagsRepository'

import { GetMessageStats } from './GetMessageStats'

let messageTagsRepository: InMemoryMessageTagsRepository
let messagesRepository: InMemoryMessagesRepository
let getMessageStats: GetMessageStats

describe('Get Message Stats', () => {
  beforeEach(() => {
    messageTagsRepository = new InMemoryMessageTagsRepository()
    messagesRepository = new InMemoryMessagesRepository(messageTagsRepository)
    getMessageStats = new GetMessageStats(messagesRepository)
  })

  it('should be able to get message stats', async () => {
    const message = Message.create({
      subject: Subject.create('Message subject').value as Subject,
      body: Body.create('Message content').value as Body,
      senderId: 'fake-sender-id',
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
    expect(response.clickRate).toBe(33.33)
    expect(response.openRate).toBe(66.67)
    expect(response.recipientsCount).toBe(3)
  })
})
