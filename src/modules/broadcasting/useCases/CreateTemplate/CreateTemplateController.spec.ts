/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Create Template (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to create new template', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const response = await request(app)
      .post('/templates')
      .set('x-access-token', token)
      .send({
        title: 'The template',
        content: 'Template body with {{ message_content }} variable.',
      })

    expect(response.status).toBe(201)

    const templateInDatabase = await prisma.template.findFirst({
      where: { title: 'The template' },
    })

    expect(templateInDatabase).toBeTruthy()
  })
})
