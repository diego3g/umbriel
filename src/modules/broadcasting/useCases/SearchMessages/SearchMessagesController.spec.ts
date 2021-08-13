/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Search Messages (e2e)', () => {
  beforeAll(async () => {
    const sender = await prisma.sender.create({
      data: {
        id: uuid(),
        name: 'Sender 01',
        email: 'sender@example.com',
      },
    })

    await prisma.message.createMany({
      data: [
        {
          id: uuid(),
          subject: 'message1',
          body: 'Message body longh enough',
          sender_id: sender.id,
        },
        {
          id: uuid(),
          subject: 'message2',
          body: 'Message body longh enough',
          sender_id: sender.id,
        },
      ],
    })
  })
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to search messages', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const response = await request(app)
      .get(`/messages/search`)
      .set('x-access-token', token)
      .query({
        query: 'message1',
      })
      .send()

    expect(response.status).toBe(200)
    expect(response.body.data.length).toBe(1)
    expect(response.body.totalCount).toBe(1)
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          subject: 'message1',
          body: 'Message body longh enough',
        }),
      ])
    )
  })
  it('should be able to search messages with case-insensitive', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const response = await request(app)
      .get(`/messages/search`)
      .set('x-access-token', token)
      .query({
        query: 'MeSsaGe1',
      })
      .send()

    expect(response.status).toBe(200)
    expect(response.body.data.length).toBe(1)
    expect(response.body.totalCount).toBe(1)
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          subject: 'message1',
          body: 'Message body longh enough',
        }),
      ])
    )
  })
})
