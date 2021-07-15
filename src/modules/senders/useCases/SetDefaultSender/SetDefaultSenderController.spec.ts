/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Set Default Sender (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to set default sender', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const notDefaultSenderId = uuid()

    await prisma.sender.createMany({
      data: [
        {
          id: uuid(),
          name: 'John Doe',
          email: 'john1@doe.com',
          is_default: true,
        },
        {
          id: notDefaultSenderId,
          name: 'John Doe',
          email: 'john2@doe.com',
          is_default: false,
        },
      ],
    })

    const response = await request(app)
      .patch(`/senders/${notDefaultSenderId}/set-as-default`)
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)

    const defaultSenders = await prisma.sender.findMany({
      where: {
        is_default: true,
      },
    })

    expect(defaultSenders.length).toBe(1)
    expect(defaultSenders[0].id).toEqual(notDefaultSenderId)
  })
})
