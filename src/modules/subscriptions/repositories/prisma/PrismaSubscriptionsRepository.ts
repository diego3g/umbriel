import { prisma } from '@infra/prisma/client'
import { Subscription } from '@modules/subscriptions/domain/contact/subscription'
import { Subscriptions } from '@modules/subscriptions/domain/contact/subscriptions'
import { SubscriptionMapper } from '@modules/subscriptions/mappers/SubscriptionMapper'

import {
  FindByContactAndTagParams,
  FindByContactAndTagsParams,
  ISubscriptionsRepository,
} from '../ISubscriptionsRepository'

export class PrismaSubscriptionsRepository implements ISubscriptionsRepository {
  async findByContactAndTag({
    contactId,
    tagId,
  }: FindByContactAndTagParams): Promise<Subscription> {
    const raw = await prisma.subscription.findUnique({
      where: {
        contact_id_tag_id: {
          tag_id: tagId,
          contact_id: contactId,
        },
      },
    })

    if (!raw) {
      return null
    }

    return SubscriptionMapper.toDomain(raw)
  }

  async findByContactAndTags({
    contactId,
    tagIds,
  }: FindByContactAndTagsParams): Promise<Subscription[]> {
    const raw = await prisma.subscription.findMany({
      where: {
        contact_id: contactId,
        tag_id: {
          in: tagIds,
        },
      },
    })

    return raw.map(item => SubscriptionMapper.toDomain(item))
  }

  async save(subscriptions: Subscriptions): Promise<void> {
    if (subscriptions.getNewItems().length > 0) {
      const data = subscriptions
        .getNewItems()
        .map(subscription => SubscriptionMapper.toPersistence(subscription))

      await prisma.subscription.createMany({
        data,
      })
    }

    if (subscriptions.getRemovedItems().length > 0) {
      const removedIds = subscriptions
        .getRemovedItems()
        .map(subscription => subscription.id)

      await prisma.subscription.deleteMany({
        where: {
          id: {
            in: removedIds,
          },
        },
      })
    }
  }

  async create(subscriptions: Subscriptions): Promise<void> {
    const data = subscriptions
      .getItems()
      .map(subscription => SubscriptionMapper.toPersistence(subscription))

    await prisma.subscription.createMany({
      data,
    })
  }
}
