/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

const {
  jwt: { token },
} = createAndAuthenticateUser()

describe('Register User (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to register new user', async () => {
    const response = await request(app)
      .post('/users')
      .set('x-access-token', token)
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456',
        password_confirmation: '123456',
      })

    expect(response.status).toBe(201)

    const userInDatabase = await prisma.user.findUnique({
      where: { email: 'john@doe.com' },
    })

    expect(userInDatabase).toBeTruthy()
  })

  it('should return an error if validation fails', async () => {
    const response = await request(app)
      .post('/users')
      .set('x-access-token', token)
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456', // missing password confirmation
      })

    expect(response.status).toBe(400)
  })
})
