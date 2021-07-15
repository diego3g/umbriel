import { Message } from '../../domain/message/message'
import {
  IMessagesRepository,
  MessagesSearchParams,
  MessagesSearchResult,
} from '../IMessagesRepository'
import { IMessageTagsRepository } from '../IMessageTagsRepository'

export class InMemoryMessagesRepository implements IMessagesRepository {
  public items: Message[] = []

  constructor(private messageTagsRepository: IMessageTagsRepository) {}

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
