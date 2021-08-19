/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Get All Senders (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to get all senders', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    await prisma.sender.createMany({
      data: [
        {
          id: uuid(),
          name: 'John Doe',
          email: 'john@doe.com',
        },
        {
          id: uuid(),
          name: 'John Doe 2',
          email: 'john2@doe.com',
        },
      ],
    })

    const response = await request(app)
      .get('/senders')
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: [
        expect.objectContaining({
          name: 'John Doe',
        }),
        expect.objectContaining({
          name: 'John Doe 2',
        }),
      ],
    })
  })
})
