import { prisma } from '@infra/prisma/client'
import { ContactWithDetails } from '@modules/subscriptions/dtos/ContactWithDetails'
import { ContactMapper } from '@modules/subscriptions/mappers/ContactMapper'
import { ContactWithDetailsMapper } from '@modules/subscriptions/mappers/ContactWithDetailsMapper'

import { Contact } from '../../domain/contact/contact'
import {
  ContactsSearchParams,
  IContactsRepository,
} from '../IContactsRepository'
import { ISubscriptionsRepository } from '../ISubscriptionsRepository'

export class PrismaContactsRepository implements IContactsRepository {
  constructor(private subscriptionsRepository: ISubscriptionsRepository) {}

  async exists(email: string): Promise<boolean> {
    const contact = await prisma.contact.findUnique({ where: { email } })

    return !!contact
  }

  async findById(id: string): Promise<Contact> {
    const contact = await prisma.contact.findUnique({ where: { id } })

    return ContactMapper.toDomain(contact)
  }

  async findByIdWithDetails(id: string): Promise<ContactWithDetails> {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        recipients: {
          include: {
            message: true,
            events: true,
          },
        },
        subscriptions: {
          include: {
            tag: true,
          },
        },
      },
    })

    return ContactWithDetailsMapper.toDto(contact)
  }

  async findByEmail(email: string): Promise<Contact> {
    const contact = await prisma.contact.findUnique({ where: { email } })

    return ContactMapper.toDomain(contact)
  }

  async findByTagsIds(tagIds: string[]): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        subscriptions: {
          some: {
            tag_id: {
              in: tagIds,
            },
          },
        },
      },
    })

    return contacts.map(contact => ContactMapper.toDomain(contact))
  }

  async search({
    query,
    page,
    perPage,
  }: ContactsSearchParams): Promise<Contact[]> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    }

    if (query) {
      queryPayload.where = {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      }
    }

    const contacts = await prisma.contact.findMany(queryPayload)

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

    await this.subscriptionsRepository.save(contact.subscriptions)
  }

  async create(contact: Contact): Promise<void> {
    const data = ContactMapper.toPersistence(contact)

    await prisma.contact.create({ data })

    await this.subscriptionsRepository.create(contact.subscriptions)
  }
}
