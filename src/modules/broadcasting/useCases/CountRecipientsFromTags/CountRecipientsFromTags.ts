import { Either, right } from '@core/logic/Either'
import { IContactsRepository } from '@modules/subscriptions/repositories/IContactsRepository'

type CountRecipientsFromTagsRequest = {
  tagIds: string[]
}

type CountRecipientsFromTagsResponse = Either<Error, { count: number }>

export class CountRecipientsFromTags {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    tagIds,
  }: CountRecipientsFromTagsRequest): Promise<CountRecipientsFromTagsResponse> {
    const recipientsCount =
      await this.contactsRepository.countSubscribersByTags(tagIds)

    return right({
      count: recipientsCount,
    })
  }
}
