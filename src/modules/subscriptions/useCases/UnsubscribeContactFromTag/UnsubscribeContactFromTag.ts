import { Either, left, right } from '@core/logic/Either'
import { ISubscriptionsRepository } from '@modules/subscriptions/repositories/ISubscriptionsRepository'

import { Contact } from '../../domain/contact/contact'
import { IContactsRepository } from '../../repositories/IContactsRepository'
import { ITagsRepository } from '../../repositories/ITagsRepository'
import { InvalidContactError } from './errors/InvalidContactError'
import { InvalidTagError } from './errors/InvalidTagError'
import { NotSubscribedError } from './errors/NotSubscribedError'

type UnsubscribeContactFromTagRequest = {
  contactId: string
  tagId: string
}

type UnsubscribeContactFromTagResponse = Either<
  InvalidContactError | InvalidTagError | NotSubscribedError,
  Contact
>

export class UnsubscribeContactFromTag {
  constructor(
    private subscriptionsRepository: ISubscriptionsRepository,
    private contactsRepository: IContactsRepository,
    private tagsRepository: ITagsRepository
  ) {}

  async execute({
    contactId,
    tagId,
  }: UnsubscribeContactFromTagRequest): Promise<UnsubscribeContactFromTagResponse> {
    const contact = await this.contactsRepository.findById(contactId)

    if (!contact) {
      return left(new InvalidContactError())
    }

    const tag = await this.tagsRepository.findById(tagId)

    if (!tag) {
      return left(new InvalidTagError())
    }

    const subscription = await this.subscriptionsRepository.findByContactAndTag(
      {
        contactId,
        tagId,
      }
    )

    if (!subscription) {
      return left(new NotSubscribedError())
    }

    contact.unsubscribeFromTag(subscription)

    await this.contactsRepository.save(contact)

    return right(contact)
  }
}
