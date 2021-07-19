import { Either, right } from '@core/logic/Either'
import { IContactsRepository } from '@modules/subscriptions/repositories/IContactsRepository'

type CountRecipientsFromTagsRequest = {
  tagsIds: string[]
}

type CountRecipientsFromTagsResponse = Either<Error, { count: number }>

export class CountRecipientsFromTags {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    tagsIds,
  }: CountRecipientsFromTagsRequest): Promise<CountRecipientsFromTagsResponse> {
    const recipientsCount =
      await this.contactsRepository.countSubscribersByTags(tagsIds)

    return right({
      count: recipientsCount,
    })
  }
}
