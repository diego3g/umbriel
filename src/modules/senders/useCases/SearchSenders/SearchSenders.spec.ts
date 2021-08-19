import { Email } from '@modules/senders/domain/sender/email'
import { Name } from '@modules/senders/domain/sender/name'
import { Sender } from '@modules/senders/domain/sender/sender'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { SearchSenders } from './SearchSenders'

let sendersRepository: InMemorySendersRepository
let searchSenders: SearchSenders

describe('Search Senders', () => {
  beforeEach(async () => {
    sendersRepository = new InMemorySendersRepository()
    searchSenders = new SearchSenders(sendersRepository)

    for (let i = 0; i < 20; i++) {
      const sender = Sender.create({
        name: Name.create(`John Doe${i}`).value as Name,
        email: Email.create('john@doe.com').value as Email,
      }).value as Sender

      await sendersRepository.create(sender)
    }
  })

  it('should be able to list senders without search', async () => {
    const response = await searchSenders.execute({ query: '' })

    expect(response.data.length).toEqual(20)
    expect(response.totalCount).toEqual(20)
  })

  it('should be able to search through senders', async () => {
    const response = await searchSenders.execute({ query: 'Doe5' })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].name.value).toEqual('John Doe5')
  })
  it('should be able to search through senders with case-insensitive', async () => {
    const response = await searchSenders.execute({ query: 'DOE5' })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].name.value).toEqual('John Doe5')
  })

  it('should be able to paginate through senders', async () => {
    let response = await searchSenders.execute({ perPage: 10 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].name.value).toEqual('John Doe0')

    response = await searchSenders.execute({ perPage: 10, page: 2 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].name.value).toEqual('John Doe10')
  })
})
