/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Unsubscribe Contact From Tag (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to unsubscribe a contact from a tag', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const contactId = uuid()
    const tagId = uuid()

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
                id: tagId,
                title: 'Tag 01',
              },
            },
          },
        },
      },
    })

    const response = await request(app)
      .delete(`/tags/${tagId}/subscribers/${contactId}`)
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)

    const subscriptionInDatabase = await prisma.subscription.findUnique({
      where: {
        contact_id_tag_id: {
          contact_id: contactId,
          tag_id: tagId,
        },
      },
    })

    expect(subscriptionInDatabase).toBeFalsy()
  })
})
