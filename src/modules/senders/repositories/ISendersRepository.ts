import { Sender } from '@modules/senders/domain/sender/sender'

export type SendersSearchParams = {
  query?: string
  page: number
  perPage: number
}

export type SendersSearchResult = {
  data: Sender[]
  totalCount: number
}

export interface ISendersRepository {
  findAll(): Promise<Sender[]>
  findById(id: string): Promise<Sender>
  findDefaultSender(): Promise<Sender>
  search(params: SendersSearchParams): Promise<SendersSearchResult>
  create(sender: Sender): Promise<void>
  delete(id: string): Promise<void>
  save(sender: Sender): Promise<void>
}
