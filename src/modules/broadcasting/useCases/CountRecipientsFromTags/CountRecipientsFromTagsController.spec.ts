/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Count Recipients From Tags (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to count recipients from tags', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const tagId1 = uuid()
    const tagId2 = uuid()

    await prisma.tag.createMany({
      data: [
        {
          id: tagId1,
          title: 'tag-01',
        },
        {
          id: tagId2,
          title: 'tag-02',
        },
      ],
    })

    await prisma.contact.create({
      data: {
        id: uuid(),
        name: 'John Doe',
        email: 'johndoe1@example.com',
        subscriptions: {
          create: {
            id: uuid(),
            tag_id: tagId1,
          },
        },
      },
    })

    await prisma.contact.create({
      data: {
        id: uuid(),
        name: 'John Doe',
        email: 'johndoe2@example.com',
        subscriptions: {
          createMany: {
            data: [
              {
                id: uuid(),
                tag_id: tagId1,
              },
              {
                id: uuid(),
                tag_id: tagId2,
              },
            ],
          },
        },
      },
    })

    const response = await request(app)
      .get('/recipients/count')
      .set('x-access-token', token)
      .send({
        tagsIds: [tagId1, tagId2],
      })

    expect(response.status).toBe(200)
    expect(response.body.data.count).toBe(2)
  })
})
