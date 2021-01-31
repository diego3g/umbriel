import { prisma } from '@infra/prisma/client'
import { ContactMapper } from '@modules/subscriptions/mappers/ContactMapper'

import { Contact } from '../../domain/contact/contact'
import { IContactsRepository } from '../IContactsRepository'

export class PrismaContactsRepository implements IContactsRepository {
  async exists(email: string): Promise<boolean> {
    const contact = await prisma.contact.findUnique({ where: { email } })

    return !!contact
  }

  async findById(id: string): Promise<Contact> {
    const contact = await prisma.contact.findUnique({ where: { id } })

    return ContactMapper.toDomain(contact)
  }

  async findByEmail(email: string): Promise<Contact> {
    const contact = await prisma.contact.findUnique({ where: { email } })

    return ContactMapper.toDomain(contact)
  }

  async findByTagsIds(tagIds: string[]): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        tags: {
          some: {
            id: {
              in: tagIds,
            },
          },
        },
      },
    })

    return contacts.map(contact => ContactMapper.toDomain(contact))
  }

  async save(contact: Contact): Promise<void> {
    const data = ContactMapper.toPersistence(contact)

    await prisma.contact.update({
      where: {
        id: contact.id,
      },
      data,
    })
  }

  async create(contact: Contact): Promise<void> {
    const data = ContactMapper.toPersistence(contact)

    await prisma.contact.create({ data })
  }
}
