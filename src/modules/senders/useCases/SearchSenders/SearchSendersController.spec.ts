/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Search Senders (e2e)', () => {
  beforeAll(async () => {
    await prisma.sender.createMany({
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
  })
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to search senders', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const response = await request(app)
      .get(`/senders/search`)
      .set('x-access-token', token)
      .query({
        query: 'johndoe1',
      })
      .send()

    expect(response.status).toBe(200)
    expect(response.body.data.length).toBe(1)
    expect(response.body.totalCount).toBe(1)
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe 1',
          email: 'johndoe1@example.com',
        }),
      ])
    )
  })
  it('should be able to search senders with case-insensitive', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const response = await request(app)
      .get(`/senders/search`)
      .set('x-access-token', token)
      .query({
        query: 'johnDoE1',
      })
      .send()

    expect(response.status).toBe(200)
    expect(response.body.data.length).toBe(1)
    expect(response.body.totalCount).toBe(1)
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe 1',
          email: 'johndoe1@example.com',
        }),
      ])
    )
  })
})
