/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Search Contacts (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to search contacts', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    await prisma.contact.createMany({
      data: [
        {
          id: uuid(),
          name: 'John Doe 1',
          email: 'johndoe1@example.com',
        },
        {
          id: uuid(),
          name: 'John Doe 2',
          email: 'johndoe2@example.com',
        },
      ],
    })

    const response = await request(app)
      .get(`/contacts/search`)
      .set('x-access-token', token)
      .query({
        query: 'johndoe1',
      })
      .send()

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe 1',
          email: 'johndoe1@example.com',
        }),
      ])
    )
  })
})
