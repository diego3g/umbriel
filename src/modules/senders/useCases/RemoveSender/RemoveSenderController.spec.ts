/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Remove Sender (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to remove sender', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const senderId = uuid()

    await prisma.sender.create({
      data: {
        id: senderId,
        name: 'John Doe',
        email: 'john@doe.com',
      },
    })

    const response = await request(app)
      .delete(`/senders/${senderId}`)
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)
  })
})
