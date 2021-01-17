import { Contact } from '../../models/contact/contact'
import { Message } from '../../models/message/message'
import { Tag } from '../../models/tag/tag'
import { IContactsRepository } from '../../repositories/IContactsRepository'
import { InMemoryContactRepository } from '../../repositories/in-memory/InMemoryContactsRepository'
import { InMemoryTagsRepository } from '../../repositories/in-memory/InMemoryTagsRepository'
import { ITagsRepository } from '../../repositories/ITagsRepository'
import { InvalidContactError } from './errors/InvalidContactError'
import { InvalidTagError } from './errors/InvalidTagError'
import { SubscribeContactToTag } from './SubscribeContactToTag'

let contactsRepository: IContactsRepository
let tagsRepository: ITagsRepository
let subscribeContactToTag: SubscribeContactToTag

describe('Send Message', () => {
  beforeEach(() => {
    contactsRepository = new InMemoryContactRepository()
    tagsRepository = new InMemoryTagsRepository()
    subscribeContactToTag = new SubscribeContactToTag(
      contactsRepository,
      tagsRepository
    )
  })

  it('should be able to subscribe contact to tag', async () => {
    const contactOrError = Contact.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })
    const contact = contactOrError.value as Contact

    await contactsRepository.create(contact)

    const tagOrError = Tag.create({
      title: 'Students',
    })

    const tag = tagOrError.value as Tag

    await tagsRepository.create(tag)

    const response = await subscribeContactToTag.execute({
      contactId: contact.id,
      tagId: tag.id,
    })

    const updatedContact = await contactsRepository.findById(contact.id)

    expect(response.isRight()).toBeTruthy()
    expect(updatedContact.tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: tag.id,
        }),
      ])
    )
  })

  it('should be able to subscribe contact that does not exists to tag', async () => {
    const response = await subscribeContactToTag.execute({
      contactId: 'invalid-contact-id',
      tagId: 'invalid-tag-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidContactError())
  })

  it('should be able to subscribe contact with non existing tag', async () => {
    const contactOrError = Contact.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })
    const contact = contactOrError.value as Contact

    await contactsRepository.create(contact)

    const response = await subscribeContactToTag.execute({
      contactId: contact.id,
      tagId: 'invalid-tag-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidTagError())
  })
})
