/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Create Sender (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to create sender', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const response = await request(app)
      .post(`/senders`)
      .set('x-access-token', token)
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
      })

    expect(response.status).toBe(201)
  })
})
