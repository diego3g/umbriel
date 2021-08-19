import { Body } from '@modules/broadcasting/domain/message/body'
import { Message } from '@modules/broadcasting/domain/message/message'
import { Subject } from '@modules/broadcasting/domain/message/subject'
import { InMemoryMessagesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryMessageTagsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessageTagsRepository'
import { InMemoryTemplatesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryTemplatesRepository'
import { Email } from '@modules/senders/domain/sender/email'
import { Name } from '@modules/senders/domain/sender/name'
import { Sender } from '@modules/senders/domain/sender/sender'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { GetMessageDetails } from './GetMessageDetails'

let getMessageDetails: GetMessageDetails
let messageTagsRepository: InMemoryMessageTagsRepository
let sendersRepository: InMemorySendersRepository
let templatesRepository: InMemoryTemplatesRepository
let messagesRepository: InMemoryMessagesRepository

describe('Get Contact Details', () => {
  beforeEach(() => {
    messageTagsRepository = new InMemoryMessageTagsRepository()
    sendersRepository = new InMemorySendersRepository()
    templatesRepository = new InMemoryTemplatesRepository()
    messagesRepository = new InMemoryMessagesRepository(
      messageTagsRepository,
      templatesRepository,
      sendersRepository
    )
    getMessageDetails = new GetMessageDetails(messagesRepository)
  })

  it('should be able to get message details', async () => {
    const sender = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('john@doe.com').value as Email,
    }).value as Sender

    sendersRepository.create(sender)

    const message = Message.create({
      subject: Subject.create('Message subject').value as Subject,
      body: Body.create('Message body with long enough content.').value as Body,
      senderId: sender.id,
    }).value as Message

    messagesRepository.create(message)

    const response = await getMessageDetails.execute({
      messageId: message.id,
    })

    expect(response.isRight()).toBeTruthy()
  })
})
