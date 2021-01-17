import { Recipient } from '../models/message/recipient'

export interface IRecipientsRepository {
  items: Recipient[]
  createMany(recipients: Recipient[]): Promise<void>
}
