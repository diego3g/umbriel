import { Either, left, right } from '../../../../core/logic/Either'
import { Contact } from '../../domain/contact/contact'
import { IContactsRepository } from '../../repositories/IContactsRepository'
import { ITagsRepository } from '../../repositories/ITagsRepository'
import { InvalidContactError } from './errors/InvalidContactError'
import { InvalidTagError } from './errors/InvalidTagError'

type UnsubscribeContactFromTagRequest = {
  contactId: string
  tagId: string
}

type UnsubscribeContactFromTagResponse = Either<Error, Contact>

export class UnsubscribeContactFromTag {
  constructor(
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

    contact.unsubscribeFromTag(tag)

    await this.contactsRepository.save(contact)

    return right(contact)
  }
}
