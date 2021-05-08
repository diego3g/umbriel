import { Recipient } from '../domain/recipient/recipient'

export type FindByMessageAndContactIdParams = {
  messageId: string
  contactId: string
}

export interface IRecipientsRepository {
  findByMessageAndContactId(
    params: FindByMessageAndContactIdParams
  ): Promise<Recipient>
  saveWithEvents(recipient: Recipient): Promise<void>
}
