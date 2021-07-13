/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Create Tag (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to subscribe a contact to a tag', async () => {
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
      },
    })

    await prisma.tag.create({
      data: {
        id: tagId,
        title: 'Tag 01',
      },
    })

    const response = await request(app)
      .post(`/tags/${tagId}/subscribers`)
      .set('x-access-token', token)
      .send({ contactId })

    expect(response.status).toBe(201)

    const subscriptionInDatabase = await prisma.subscription.findFirst({
      where: {
        contact_id: contactId,
        tag_id: tagId,
      },
    })

    expect(subscriptionInDatabase).toBeTruthy()
  })
})
