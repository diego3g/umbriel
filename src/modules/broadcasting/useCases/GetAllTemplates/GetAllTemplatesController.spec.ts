/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Get All Templates (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to get all templates', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    await prisma.template.createMany({
      data: [
        {
          id: uuid(),
          title: 'Template 01',
          content: 'Template content with {{ message_content }} variable.',
        },
        {
          id: uuid(),
          title: 'Template 02',
          content: 'Template content with {{ message_content }} variable.',
        },
      ],
    })

    const response = await request(app)
      .get('/templates')
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: [
        expect.objectContaining({
          title: 'Template 01',
        }),
        expect.objectContaining({
          title: 'Template 02',
        }),
      ],
    })
  })
})
