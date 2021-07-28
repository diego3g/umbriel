import { Either, left, right } from '@core/logic/Either'
import { IContactsRepository } from '@modules/subscriptions/repositories/IContactsRepository'
import { ISubscriptionsRepository } from '@modules/subscriptions/repositories/ISubscriptionsRepository'
import { ITagsRepository } from '@modules/subscriptions/repositories/ITagsRepository'

import { ContactNotFoundError } from './errors/ContactNotFoundError'

type UnsubscribeContactFromIntegrationRequest = {
  contactIntegrationId: string
  tagIntegrationIds: string[]
}

type UnsubscribeContactFromIntegrationResponse = Either<
  ContactNotFoundError,
  null
>

export class UnsubscribeContactFromIntegration {
  constructor(
    private tagsRepository: ITagsRepository,
    private subscriptionsRepository: ISubscriptionsRepository,
    private contactsRepository: IContactsRepository
  ) {}

  async execute({
    contactIntegrationId,
    tagIntegrationIds,
  }: UnsubscribeContactFromIntegrationRequest): Promise<UnsubscribeContactFromIntegrationResponse> {
    const contact = await this.contactsRepository.findByIntegrationId(
      contactIntegrationId
    )

    if (!contact) {
      return left(new ContactNotFoundError())
    }

    const tags = await this.tagsRepository.findManyByIntegrationIds(
      tagIntegrationIds
    )

    if (tags.length > 0) {
      const tagIds = tags.map(tag => tag.id)

      const subscriptions =
        await this.subscriptionsRepository.findByContactAndTags({
          contactId: contact.id,
          tagIds,
        })

      subscriptions.forEach(subscription => {
        contact.unsubscribeFromTag(subscription)
      })

      await this.contactsRepository.save(contact)
    }

    return right(null)
  }
}
