import { Subscription } from '../domain/contact/subscription'
import { Subscriptions } from '../domain/contact/subscriptions'

export type FindByContactAndTagParams = {
  contactId: string
  tagId: string
}

export type FindByContactAndTagsParams = {
  contactId: string
  tagIds: string[]
}

export interface ISubscriptionsRepository {
  findByContactAndTag(params: FindByContactAndTagParams): Promise<Subscription>
  findByContactAndTags(
    params: FindByContactAndTagsParams
  ): Promise<Subscription[]>
  save(subscriptions: Subscriptions): Promise<void>
  create(subscriptions: Subscriptions): Promise<void>
}
