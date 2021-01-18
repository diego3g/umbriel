import { Recipient } from '../domain/message/recipient'

export interface IRecipientsRepository {
  items: Recipient[]
  createMany(recipients: Recipient[]): Promise<void>
}
