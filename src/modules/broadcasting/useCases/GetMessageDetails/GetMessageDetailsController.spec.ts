/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Get Message Details (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to get message details', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const messageId = uuid()

    await prisma.message.create({
      data: {
        id: messageId,
        subject: 'Message subject',
        body: 'Message body',
        sender: {
          create: {
            id: uuid(),
            name: 'John Doe',
            email: 'john@doe.com',
          },
        },
        tags: {
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
      },
    })

    const response = await request(app)
      .get(`/messages/${messageId}`)
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        subject: 'Message subject',
        sender: expect.objectContaining({
          name: 'John Doe',
        }),
        tags: [
          expect.objectContaining({
            title: 'Tag 01',
          }),
        ],
      })
    )
  })
})
