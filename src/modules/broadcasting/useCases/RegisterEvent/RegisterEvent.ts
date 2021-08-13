import { Either, left, right } from '@core/logic/Either'
import { Event } from '@modules/broadcasting/domain/event/event'
import { Type, ValidEventTypes } from '@modules/broadcasting/domain/event/type'
import { Recipient } from '@modules/broadcasting/domain/recipient/recipient'
import { IRecipientsRepository } from '@modules/broadcasting/repositories/IRecipientsRepository'
import { IContactsRepository } from '@modules/subscriptions/repositories/IContactsRepository'

import { InvalidEventError } from './errors/InvalidEventError'

type RegisterEventRequest = {
  messageId: string
  contactId: string
  event: {
    type: ValidEventTypes
    meta?: any
  }
}

type RegisterEventResponse = Either<InvalidEventError, Event>

export class RegisterEvent {
  constructor(
    private recipientsRepository: IRecipientsRepository,
    private contactsRepository: IContactsRepository
  ) {}

  async execute({
    contactId,
    messageId,
    event,
  }: RegisterEventRequest): Promise<RegisterEventResponse> {
    const recipient = Recipient.create({
      contactId,
      messageId,
    })

    const eventTypeOrError = Type.create(event.type)

    if (eventTypeOrError.isLeft()) {
      return left(new InvalidEventError())
    }

    const incomingEventOrError = Event.create({
      recipientId: recipient.id,
      type: eventTypeOrError.value,
      meta: event.meta,
    })

    if (incomingEventOrError.isLeft()) {
      return left(new InvalidEventError())
    }

    recipient.addEvent(incomingEventOrError.value)

    await this.recipientsRepository.saveOrCreateWithEvents(recipient)

    if (event.meta?.bounceType?.toLowerCase() === 'permanent') {
      const contact = await this.contactsRepository.findById(contactId)

      contact.bounce()

      await this.contactsRepository.save(contact)
    }

    return right(incomingEventOrError.value)
  }
}
