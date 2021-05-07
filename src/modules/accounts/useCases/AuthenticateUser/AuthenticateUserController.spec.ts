/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import bcrypt from 'bcryptjs'
import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'

describe('Authenticate User (e2e)', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: uuid(),
        name: 'John Doe',
        email: 'john@doe.com',
        password: await bcrypt.hash('123456', 8),
      },
    })
  })

  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to authenticate', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'john@doe.com',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    )
  })
})
