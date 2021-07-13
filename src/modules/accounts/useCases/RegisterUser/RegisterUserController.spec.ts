/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'

describe('Register User (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('Should return 400 if validation fails', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoecom', // invalid email
      password: '123456',
      password_confirmation: '123456',
    })

    expect(response.status).toBe(400)

    const userInDatabase = await prisma.user.findUnique({
      where: { email: 'john@doe.com' },
    })

    expect(userInDatabase).toBeFalsy()
  })

  it('should be able to register new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(response.status).toBe(201)

    const userInDatabase = await prisma.user.findUnique({
      where: { email: 'john@doe.com' },
    })

    expect(userInDatabase).toBeTruthy()
  })
})
