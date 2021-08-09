import { Email } from '@modules/senders/domain/sender/email'
import { Name } from '@modules/senders/domain/sender/name'
import { Sender } from '@modules/senders/domain/sender/sender'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { GetAllSenders } from './GetAllSenders'

let sendersRepository: InMemorySendersRepository
let getAllSenders: GetAllSenders

describe('Get All Senders', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySendersRepository()
    getAllSenders = new GetAllSenders(sendersRepository)
  })

  it('should be able to get all senders', async () => {
    const sender1 = Sender.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('john@doe.com').value as Email,
    }).value as Sender

    const sender2 = Sender.create({
      name: Name.create('John Doe 2').value as Name,
      email: Email.create('john2@doe.com').value as Email,
    }).value as Sender

    sendersRepository.create(sender1)
    sendersRepository.create(sender2)

    const response = await getAllSenders.execute()

    expect(response.length).toBe(2)
    expect(response[0].name.value).toEqual('John Doe')
    expect(response[1].name.value).toEqual('John Doe 2')
  })
})
