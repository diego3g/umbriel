import { Message } from '@modules/broadcasting/domain/message/message'
import { IMessagesRepository } from '@modules/broadcasting/repositories/IMessagesRepository'

type SearchMessagesRequest = {
  query?: string
  page?: number
  perPage?: number
}

type SearchMessagesResponse = {
  data: Message[]
  totalCount: number
}

export class SearchMessages {
  constructor(private messagesRepository: IMessagesRepository) {}

  async execute({
    query,
    page = 1,
    perPage = 20,
  }: SearchMessagesRequest): Promise<SearchMessagesResponse> {
    const { data, totalCount } = await this.messagesRepository.search({
      query,
      page,
      perPage,
    })

    return { data, totalCount }
  }
}
