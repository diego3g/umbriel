/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Get Contact Details (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to get contact details', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const contactId = uuid()

    await prisma.contact.create({
      data: {
        id: contactId,
        name: 'John Doe',
        email: 'john@doe.com',
        subscriptions: {
          create: {
            id: uuid(),
            tag: {
              create: {
                id: uuid(),
                title: 'Tag 01',
              },
            },
          },
        },
        recipients: {
          create: {
            id: uuid(),
            message: {
              create: {
                id: uuid(),
                subject: 'Custom message subject',
                body: 'A message body with enough length',
                sender: {
                  create: {
                    id: uuid(),
                    name: 'John Sender',
                    email: 'johnsender@example.com',
                  },
                },
              },
            },
            events: {
              create: {
                id: uuid(),
                type: 'OPEN',
              },
            },
          },
        },
      },
    })

    const response = await request(app)
      .get(`/contacts/${contactId}`)
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        subscriptions: [
          expect.objectContaining({
            tag: expect.objectContaining({
              title: 'Tag 01',
            }),
          }),
        ],
        messages: [
          expect.objectContaining({
            subject: 'Custom message subject',
            events: [
              expect.objectContaining({
                type: 'OPEN',
              }),
            ],
          }),
        ],
      })
    )
  })
})
