import { Email } from '@modules/senders/domain/sender/email'
import { Name } from '@modules/senders/domain/sender/name'
import { Sender } from '@modules/senders/domain/sender/sender'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { RemoveSender } from './RemoveSender'

let removeSender: RemoveSender
let sendersRepository: InMemorySendersRepository

describe('Remove Sender', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySendersRepository()
    removeSender = new RemoveSender(sendersRepository)
  })

  it('should be able to remove sender', async () => {
    const sender = Sender.create(
      {
        name: Name.create('John Doe').value as Name,
        email: Email.create('john@doe.com').value as Email,
      },
      'sender-id'
    ).value as Sender

    sendersRepository.create(sender)

    const response = await removeSender.execute({
      senderId: 'sender-id',
    })

    expect(response.isRight()).toBeTruthy()
  })
})
