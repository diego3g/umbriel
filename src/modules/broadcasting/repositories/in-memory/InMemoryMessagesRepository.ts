import { MessageStats } from '@modules/broadcasting/dtos/MessageStats'
import { MessageWithDetails } from '@modules/broadcasting/dtos/MessageWithDetails'
import { MessageStatsMapper } from '@modules/broadcasting/mappers/MessageStatsMapper'
import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { Message } from '../../domain/message/message'
import {
  IMessagesRepository,
  MessagesSearchParams,
  MessagesSearchResult,
} from '../IMessagesRepository'
import { InMemoryMessageTagsRepository } from './InMemoryMessageTagsRepository'
import { InMemoryTemplatesRepository } from './InMemoryTemplatesRepository'

export class InMemoryMessagesRepository implements IMessagesRepository {
  public items: Message[] = []

  constructor(
    private messageTagsRepository: InMemoryMessageTagsRepository,
    private templatesRepository: InMemoryTemplatesRepository,
    private sendersRepository: InMemorySendersRepository
  ) {}

  async findById(id: string): Promise<Message> {
    return this.items.find(message => message.id === id)
  }

  async findByIdWithDetails(id: string): Promise<MessageWithDetails> {
    const message = this.items.find(message => message.id === id)

    const sender = await this.sendersRepository.findById(message.senderId)
    const template = await this.templatesRepository.findById(message.templateId)

    return {
      id: message.id,
      subject: message.subject.value,
      body: message.body.value,
      sentAt: message.sentAt,
      sender: {
        name: sender.name.value,
        email: sender.email.value,
      },
      template: template
        ? {
            title: template.title.value,
            content: template.content.value,
          }
        : null,
      tags: [],
    }
  }

  async search({
    query,
    page,
    perPage,
  }: MessagesSearchParams): Promise<MessagesSearchResult> {
    let messageList = this.items

    if (query) {
      messageList = this.items.filter(message => {
        const search = new RegExp(query, 'i')
        return search.test(message.subject.value)
      })
    }

    return {
      data: messageList.slice((page - 1) * perPage, page * perPage),
      totalCount: messageList.length,
    }
  }

  async getMessageStats(messageId: string): Promise<MessageStats> {
    const result = {
      CLICK: new Set<string>(),
      DELIVER: new Set<string>(),
      OPEN: new Set<string>(),
    }

    const message = this.items.find(item => item.id === messageId)

    message.recipients.forEach(recipient => {
      recipient.events.forEach(event => {
        switch (event.type.value) {
          case 'CLICK':
            result.CLICK.add(recipient.id)
            break
          case 'DELIVER':
            result.DELIVER.add(recipient.id)
            break
          case 'OPEN':
            result.OPEN.add(recipient.id)
            break
          default:
            break
        }
      })
    })

    return MessageStatsMapper.toDto({
      RECIPIENT: message.recipientsCount,
      CLICK: result.CLICK.size,
      DELIVER: result.DELIVER.size,
      OPEN: result.OPEN.size,
    })
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
