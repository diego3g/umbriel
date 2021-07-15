/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Search Tags (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to search tags', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    await prisma.tag.createMany({
      data: [
        {
          id: uuid(),
          title: 'tag-1',
        },
        {
          id: uuid(),
          title: 'tag-2',
        },
      ],
    })

    const response = await request(app)
      .get(`/tags/search`)
      .set('x-access-token', token)
      .query({
        query: 'g-1',
      })
      .send()

    expect(response.status).toBe(200)
    expect(response.body.data.length).toBe(1)
    expect(response.body.totalCount).toBe(1)
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'tag-1',
        }),
      ])
    )
  })
})
