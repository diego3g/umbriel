/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Get All Tags (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to get all tags', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    await prisma.tag.createMany({
      data: [
        {
          id: uuid(),
          title: 'Tag 01',
        },
        {
          id: uuid(),
          title: 'Tag 02',
        },
        {
          id: uuid(),
          title: 'Tag 03',
        },
      ],
    })

    const response = await request(app)
      .get('/tags')
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: [
        expect.objectContaining({
          title: 'Tag 01',
        }),
        expect.objectContaining({
          title: 'Tag 02',
        }),
        expect.objectContaining({
          title: 'Tag 03',
        }),
      ],
    })
  })
})
