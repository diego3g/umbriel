import { Recipient } from '../domain/message/recipient'

export interface IRecipientsRepository {
  createMany(recipients: Recipient[]): Promise<void>
}
