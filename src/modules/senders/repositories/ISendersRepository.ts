import { Sender } from '@modules/senders/domain/sender/sender'

export interface ISendersRepository {
  findById(id: string): Promise<Sender>
  findDefaultSender(): Promise<Sender>
  create(sender: Sender): Promise<void>
  delete(id: string): Promise<void>
  save(sender: Sender): Promise<void>
}
