import { Recipient } from '@modules/broadcasting/domain/recipient/recipient'
import { InMemoryRecipientsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryRecipientsRepository'
import { IRecipientsRepository } from '@modules/broadcasting/repositories/IRecipientsRepository'

import { RegisterEvent } from './RegisterEvent'

let recipientsRepository: IRecipientsRepository
let registerEvent: RegisterEvent

describe('Send Message', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()

    registerEvent = new RegisterEvent(recipientsRepository)
  })

  it('should be able to register an event with new recipient', async () => {
    const response = await registerEvent.execute({
      contactId: 'contact-id',
      messageId: 'message-id',
      event: {
        type: 'DELIVER',
      },
    })

    expect(response.isRight()).toBeTruthy()
  })

  it('should be able to register an event with existing recipient', async () => {
    const recipient = Recipient.create({
      contactId: 'contact-id',
      messageId: 'message-id',
    })

    await recipientsRepository.saveWithEvents(recipient)

    const response = await registerEvent.execute({
      contactId: 'contact-id',
      messageId: 'message-id',
      event: {
        type: 'DELIVER',
      },
    })

    expect(response.isRight()).toBeTruthy()
  })
})
