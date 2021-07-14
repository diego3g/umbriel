/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Unsubscribe Contact (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to unsubscribe contact', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const contactId = uuid()

    await prisma.contact.create({
      data: {
        id: contactId,
        name: 'John Doe',
        email: 'john@doe.com',
      },
    })

    const response = await request(app)
      .patch(`/contacts/${contactId}/unsubscribe`)
      .set('x-access-token', token)
      .send()

    const updatedContact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
    })

    expect(response.status).toBe(200)
    expect(updatedContact.is_unsubscribed).toBe(true)
  })
})
