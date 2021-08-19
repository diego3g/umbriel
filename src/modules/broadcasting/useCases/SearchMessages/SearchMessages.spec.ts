import { Body } from '@modules/broadcasting/domain/message/body'
import { Message } from '@modules/broadcasting/domain/message/message'
import { Subject } from '@modules/broadcasting/domain/message/subject'
import { InMemoryMessagesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessagesRepository'
import { InMemoryMessageTagsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryMessageTagsRepository'
import { InMemoryTemplatesRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryTemplatesRepository'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { SearchMessages } from './SearchMessages'

let sendersRepository: InMemorySendersRepository
let messageTagsRepository: InMemoryMessageTagsRepository
let templatesRepository: InMemoryTemplatesRepository
let messagesRepository: InMemoryMessagesRepository
let searchMessages: SearchMessages

describe('Search Messages', () => {
  beforeEach(async () => {
    sendersRepository = new InMemorySendersRepository()
    templatesRepository = new InMemoryTemplatesRepository()
    messageTagsRepository = new InMemoryMessageTagsRepository()
    messagesRepository = new InMemoryMessagesRepository(
      messageTagsRepository,
      templatesRepository,
      sendersRepository
    )
    searchMessages = new SearchMessages(messagesRepository)

    for (let i = 0; i < 20; i++) {
      const message = Message.create({
        subject: Subject.create(`message-${i}`).value as Subject,
        body: Body.create('Message content with long enough content.')
          .value as Body,
        senderId: 'fake-sender-id',
      }).value as Message

      await messagesRepository.create(message)
    }
  })

  it('should be able to list messages without search', async () => {
    const response = await searchMessages.execute({ query: '' })

    expect(response.data.length).toEqual(20)
    expect(response.totalCount).toEqual(20)
  })

  it('should be able to search through messages', async () => {
    const response = await searchMessages.execute({ query: 'age-5' })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].subject.value).toEqual('message-5')
  })
  it('should be able to search through messages ignoring case-sensitive', async () => {
    const response = await searchMessages.execute({ query: 'AgE-5' })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].subject.value).toEqual('message-5')
  })

  it('should be able to paginate through messages', async () => {
    let response = await searchMessages.execute({ perPage: 10 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].subject.value).toEqual('message-0')

    response = await searchMessages.execute({ perPage: 10, page: 2 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].subject.value).toEqual('message-10')
  })
})
