/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Send Message (e2e)', () => {
  beforeAll(async () => {
    await redisConnection.flushdb()
  })

  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to send message', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const message = await prisma.message.create({
      data: {
        id: uuid(),
        subject: 'My new message',
        body: 'A message to be sent with a whole body',
        sender: {
          create: {
            id: uuid(),
            name: 'John Sender',
            email: 'johnsender@example.com',
          },
        },
        tags: {
          create: {
            id: uuid(),
            tag: {
              create: {
                id: uuid(),
                title: 'New tag',
                subscribers: {
                  create: {
                    id: uuid(),
                    contact: {
                      create: {
                        id: uuid(),
                        name: 'John doe',
                        email: 'johndoe@example.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    const response = await request(app)
      .post(`/messages/${message.id}/send`)
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)

    const allMessagesInRedis = await redisConnection.keys('bull:mail-queue:*')

    expect(allMessagesInRedis).toContain('bull:mail-queue:1')
  })
})
