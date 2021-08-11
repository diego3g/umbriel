/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Get Message Stats (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to get message stats', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const messageId = uuid()

    const contactId1 = uuid()
    const contactId2 = uuid()
    const contactId3 = uuid()
    const contactId4 = uuid()

    await prisma.$transaction([
      prisma.contact.createMany({
        data: [
          {
            id: contactId1,
            name: 'Contact 01',
            email: 'contact1@example.com',
          },
          {
            id: contactId2,
            name: 'Contact 02',
            email: 'contact2@example.com',
          },
          {
            id: contactId3,
            name: 'Contact 03',
            email: 'contact3@example.com',
          },
          {
            id: contactId4,
            name: 'Contact 04',
            email: 'contact4@example.com',
          },
        ],
      }),
      prisma.message.create({
        data: {
          id: messageId,
          subject: 'Message subject',
          body: 'Message body',
          recipients_count: 4,
          sender: {
            create: {
              id: uuid(),
              name: 'John Doe',
              email: 'john@doe.com',
            },
          },
        },
      }),
      prisma.recipient.create({
        data: {
          id: uuid(),
          message_id: messageId,
          contact_id: contactId1,
          events: {
            createMany: {
              data: [
                {
                  id: uuid(),
                  type: 'DELIVER',
                },
                {
                  id: uuid(),
                  type: 'OPEN',
                },
                {
                  id: uuid(),
                  type: 'CLICK',
                },
                {
                  id: uuid(),
                  type: 'CLICK',
                },
              ],
            },
          },
        },
      }),
      prisma.recipient.create({
        data: {
          id: uuid(),
          message_id: messageId,
          contact_id: contactId2,
          events: {
            createMany: {
              data: [
                {
                  id: uuid(),
                  type: 'DELIVER',
                },
                {
                  id: uuid(),
                  type: 'OPEN',
                },
              ],
            },
          },
        },
      }),
      prisma.recipient.create({
        data: {
          id: uuid(),
          message_id: messageId,
          contact_id: contactId3,
          events: {
            createMany: {
              data: [
                {
                  id: uuid(),
                  type: 'DELIVER',
                },
              ],
            },
          },
        },
      }),
      prisma.recipient.create({
        data: {
          id: uuid(),
          message_id: messageId,
          contact_id: contactId4,
        },
      }),
    ])

    const response = await request(app)
      .get(`/messages/${messageId}/stats`)
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      recipientsCount: 4,
      deliverCount: 3,
      openRate: 66.67,
      clickCount: 1,
      clickRate: 50,
    })
  })
})
