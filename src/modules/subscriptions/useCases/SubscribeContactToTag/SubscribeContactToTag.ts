import { Either, left, right } from '@core/logic/Either'
import { Subscription } from '@modules/subscriptions/domain/contact/subscription'

import { Contact } from '../../domain/contact/contact'
import { IContactsRepository } from '../../repositories/IContactsRepository'
import { ITagsRepository } from '../../repositories/ITagsRepository'
import { InvalidContactError } from './errors/InvalidContactError'
import { InvalidTagError } from './errors/InvalidTagError'

type SubscribeContactToTagRequest = {
  contactId: string
  tagId: string
}

type SubscribeContactToTagResponse = Either<
  InvalidContactError | InvalidTagError,
  Contact
>

export class SubscribeContactToTag {
  constructor(
    private contactsRepository: IContactsRepository,
    private tagsRepository: ITagsRepository
  ) {}

  async execute({
    contactId,
    tagId,
  }: SubscribeContactToTagRequest): Promise<SubscribeContactToTagResponse> {
    const contact = await this.contactsRepository.findById(contactId)

    if (!contact) {
      return left(new InvalidContactError())
    }

    const tag = await this.tagsRepository.findById(tagId)

    if (!tag) {
      return left(new InvalidTagError())
    }

    const subscription = Subscription.create({
      contactId,
      tagId,
    })

    contact.subscribeToTag(subscription)

    await this.contactsRepository.save(contact)

    return right(contact)
  }
}
