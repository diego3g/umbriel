import { Recipient } from '../domain/recipient/recipient'

export interface IRecipientsRepository {
  createMany(recipients: Recipient[]): Promise<void>
}
