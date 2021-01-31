import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { Title } from '@modules/subscriptions/domain/tag/title'

import { Contact } from '../../domain/contact/contact'
import { Tag } from '../../domain/tag/tag'
import { IContactsRepository } from '../../repositories/IContactsRepository'
import { InMemoryContactsRepository } from '../../repositories/in-memory/InMemoryContactsRepository'
import { InMemoryTagsRepository } from '../../repositories/in-memory/InMemoryTagsRepository'
import { ITagsRepository } from '../../repositories/ITagsRepository'
import { InvalidContactError } from './errors/InvalidContactError'
import { InvalidTagError } from './errors/InvalidTagError'
import { UnsubscribeContactFromTag } from './UnsubscribeContactFromTag'

let contactsRepository: IContactsRepository
let tagsRepository: ITagsRepository
let unsubscribeContactFromTag: UnsubscribeContactFromTag

describe('Send Message', () => {
  beforeEach(() => {
    contactsRepository = new InMemoryContactsRepository()
    tagsRepository = new InMemoryTagsRepository()
    unsubscribeContactFromTag = new UnsubscribeContactFromTag(
      contactsRepository,
      tagsRepository
    )
  })

  it('should be able to unsubscribe contact from tag', async () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email

    const contactOrError = Contact.create({
      name,
      email,
    })

    const contact = contactOrError.value as Contact

    await contactsRepository.create(contact)

    const title = Title.create('Tag 01').value as Title

    const tagOrError = Tag.create({
      title,
    })

    const tag = tagOrError.value as Tag

    await tagsRepository.create(tag)

    contact.subscribeToTag(tag)

    await contactsRepository.save(contact)

    const response = await unsubscribeContactFromTag.execute({
      contactId: contact.id,
      tagId: tag.id,
    })

    const updatedContact = await contactsRepository.findById(contact.id)

    expect(response.isRight()).toBeTruthy()
    expect(updatedContact.tags).toEqual([])
  })

  it('should not be able to subscribe contact that does not exists to tag', async () => {
    const response = await unsubscribeContactFromTag.execute({
      contactId: 'invalid-contact-id',
      tagId: 'invalid-tag-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidContactError())
  })

  it('should not be able to subscribe contact with non existing tag', async () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email

    const contactOrError = Contact.create({
      name,
      email,
    })
    const contact = contactOrError.value as Contact

    await contactsRepository.create(contact)

    const response = await unsubscribeContactFromTag.execute({
      contactId: contact.id,
      tagId: 'invalid-tag-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidTagError())
  })
})
