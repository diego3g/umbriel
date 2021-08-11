/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Preview Template (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to preview template', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const response = await request(app)
      .post(`/templates/preview`)
      .set('x-access-token', token)
      .send({
        html: '<h1>Title</h1>{{ message_content }}<p>Footer</p>',
      })

    expect(response.status).toBe(200)
    expect(response.body.preview).toEqual(
      expect.stringContaining('<h1>Title</h1>')
    )
    expect(response.body.preview).toEqual(
      expect.stringContaining('<p>Footer</p>')
    )
    expect(response.body.preview).toEqual(
      expect.stringContaining('<h1>This is an example heading</h1>')
    )
  })
})
