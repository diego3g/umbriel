import { Either, left, right } from '@core/logic/Either'
import { createContact } from '@modules/subscriptions/domain/contact/services/createContact'
import { Subscription } from '@modules/subscriptions/domain/contact/subscription'
import { createTag } from '@modules/subscriptions/domain/tag/services/createTag'
import { IContactsRepository } from '@modules/subscriptions/repositories/IContactsRepository'
import { ISubscriptionsRepository } from '@modules/subscriptions/repositories/ISubscriptionsRepository'
import { ITagsRepository } from '@modules/subscriptions/repositories/ITagsRepository'

type SubscribeContactFromIntegrationRequest = {
  contact: {
    integrationId: string
    name: string
    email: string
  }
  tag: {
    integrationId: string
    title: string
  }
}

type SubscribeContactFromIntegrationResponse = Either<Error, null>

export class SubscribeContactFromIntegration {
  constructor(
    private tagsRepository: ITagsRepository,
    private contactsRepository: IContactsRepository,
    private subscriptionsRepository: ISubscriptionsRepository
  ) {}

  async execute({
    contact,
    tag,
  }: SubscribeContactFromIntegrationRequest): Promise<SubscribeContactFromIntegrationResponse> {
    let subscribedTag = await this.tagsRepository.findByIntegrationId(
      tag.integrationId
    )

    if (!subscribedTag) {
      const tagOrError = createTag({
        title: tag.title,
      })

      if (tagOrError.isLeft()) {
        return left(tagOrError.value)
      }

      subscribedTag = tagOrError.value

      await this.tagsRepository.create(subscribedTag)
    }

    let subscribedContact = await this.contactsRepository.findByIntegrationId(
      contact.integrationId
    )

    if (!subscribedContact) {
      subscribedContact = await this.contactsRepository.findByEmail(
        contact.email
      )
    }

    if (!subscribedContact) {
      const contactOrError = createContact({
        name: contact.name,
        email: contact.email,
      })

      if (contactOrError.isLeft()) {
        return left(contactOrError.value)
      }

      subscribedContact = contactOrError.value

      await this.contactsRepository.create(subscribedContact)
    }

    if (!subscribedTag.integrationId) {
      subscribedTag.integrationId = tag.integrationId

      await this.tagsRepository.save(subscribedTag)
    }

    if (!subscribedContact.integrationId) {
      subscribedContact.integrationId = contact.integrationId
    }

    const alreadySubscribed =
      await this.subscriptionsRepository.findByContactAndTag({
        tagId: subscribedTag.id,
        contactId: subscribedContact.id,
      })

    if (!alreadySubscribed) {
      const subscription = Subscription.create({
        tagId: subscribedTag.id,
        contactId: subscribedContact.id,
      })

      subscribedContact.subscribeToTag(subscription)
    }

    await this.contactsRepository.save(subscribedContact)

    return right(null)
  }
}
