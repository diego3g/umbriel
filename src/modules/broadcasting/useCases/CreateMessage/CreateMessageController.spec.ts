/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Create Message (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to create new message', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const template = await prisma.template.create({
      data: {
        id: uuid(),
        title: 'Template 01',
        content: 'A message template with {{ message_content }}',
      },
    })

    const tag = await prisma.tag.create({
      data: {
        id: uuid(),
        title: 'Tag 01',
      },
    })

    const sender = await prisma.sender.create({
      data: {
        id: uuid(),
        name: 'John Sender',
        email: 'johnsender@example.com',
      },
    })

    const response = await request(app)
      .post('/messages')
      .set('x-access-token', token)
      .send({
        subject: 'The message subject',
        body: 'A message body with enough length',
        templateId: template.id,
        senderId: sender.id,
        tags: [tag.id],
      })

    expect(response.status).toBe(201)

    const messageInDatabase = await prisma.message.findFirst({
      where: { subject: 'The message subject' },
    })

    expect(messageInDatabase).toBeTruthy()
  })
})
