import { Sender } from '@modules/senders/domain/sender/sender'

export interface ISendersRepository {
  findById(id: string): Promise<Sender>
  create(sender: Sender): Promise<void>
}
