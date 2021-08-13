import { prisma } from '@infra/prisma/client'
import { ContactWithDetails } from '@modules/subscriptions/dtos/ContactWithDetails'
import { ContactMapper } from '@modules/subscriptions/mappers/ContactMapper'
import { ContactWithDetailsMapper } from '@modules/subscriptions/mappers/ContactWithDetailsMapper'

import { Contact } from '../../domain/contact/contact'
import {
  ContactsSearchParams,
  ContactsSearchResult,
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

    if (!contact) {
      return null
    }

    return ContactMapper.toDomain(contact)
  }

  async findByIntegrationId(integration_id: string): Promise<Contact> {
    const contact = await prisma.contact.findUnique({
      where: { integration_id },
    })

    if (!contact) {
      return null
    }

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

    if (!contact) {
      return null
    }

    return ContactWithDetailsMapper.toDto(contact)
  }

  async findByEmail(email: string): Promise<Contact> {
    const contact = await prisma.contact.findUnique({ where: { email } })

    if (!contact) {
      return null
    }

    return ContactMapper.toDomain(contact)
  }

  async countSubscribersByTags(tagsIds: string[]): Promise<number> {
    const contacts = await prisma.contact.count({
      where: {
        is_unsubscribed: false,
        is_blocked: false,
        is_bounced: false,
        subscriptions: {
          some: {
            tag_id: {
              in: tagsIds,
            },
          },
        },
      },
    })

    return contacts
  }

  async findSubscribedByTags(tagIds: string[]): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        is_unsubscribed: false,
        is_blocked: false,
        is_bounced: false,
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
  }: ContactsSearchParams): Promise<ContactsSearchResult> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    }

    if (query) {
      queryPayload.where = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      }
    }

    const contacts = await prisma.contact.findMany({
      ...queryPayload,
      orderBy: {
        email: 'asc',
      },
    })

    const contactsCount = await prisma.contact.aggregate({
      _count: true,
      where: queryPayload.where,
    })

    return {
      data: contacts.map(contact => ContactMapper.toDomain(contact)),
      totalCount: contactsCount._count,
    }
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

  async delete(contact: Contact): Promise<void> {
    await prisma.contact.delete({ where: { id: contact.id } })
  }
}
