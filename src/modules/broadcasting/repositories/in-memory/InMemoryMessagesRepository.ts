import { MessageStats } from '@modules/broadcasting/dtos/MessageStats'
import {
  MessageStatsMapper,
  MessageStatsRaw,
} from '@modules/broadcasting/mappers/MessageStatsMapper'

import { Message } from '../../domain/message/message'
import {
  IMessagesRepository,
  MessagesSearchParams,
  MessagesSearchResult,
} from '../IMessagesRepository'
import { InMemoryMessageTagsRepository } from './InMemoryMessageTagsRepository'

export class InMemoryMessagesRepository implements IMessagesRepository {
  public items: Message[] = []

  constructor(private messageTagsRepository: InMemoryMessageTagsRepository) {}

  async findById(id: string): Promise<Message> {
    return this.items.find(message => message.id === id)
  }

  async search({
    query,
    page,
    perPage,
  }: MessagesSearchParams): Promise<MessagesSearchResult> {
    let messageList = this.items

    if (query) {
      messageList = this.items.filter(message =>
        message.subject.value.includes(query)
      )
    }

    return {
      data: messageList.slice((page - 1) * perPage, page * perPage),
      totalCount: messageList.length,
    }
  }

  async getMessageStats(messageId: string): Promise<MessageStats> {
    const result = {
      CLICK: 0,
      DELIVER: 0,
      OPEN: 0,
    } as MessageStatsRaw

    this.items
      .find(item => item.id === messageId)
      .recipients.forEach(recipient => {
        recipient.events.forEach(event => {
          switch (event.type.value) {
            case 'CLICK':
              result.CLICK++
              break
            case 'DELIVER':
              result.DELIVER++
              break
            case 'OPEN':
              result.OPEN++
              break
            default:
              break
          }
        })
      })

    return MessageStatsMapper.toDto(result)
  }

  async save(message: Message): Promise<void> {
    const messageIndex = this.items.findIndex(
      findMessage => findMessage.id === message.id
    )

    this.items[messageIndex] = message

    this.messageTagsRepository.save(message.tags)
  }

  async create(message: Message): Promise<void> {
    this.items.push(message)

    this.messageTagsRepository.create(message.tags)
  }
}
