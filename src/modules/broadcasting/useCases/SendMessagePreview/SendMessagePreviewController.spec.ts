/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { SESProvider } from '@infra/providers/implementations/mail/AmazonSESProvider'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

const sendEmailMock = jest.fn()

jest.spyOn(SESProvider.prototype, 'sendEmail').mockImplementation(sendEmailMock)

describe('Send Message Preview (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to send message preview', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const messageId = uuid()

    await prisma.message.create({
      data: {
        id: messageId,
        subject: 'My new message',
        body: 'This is a test message with long enough content.',
        sender: {
          create: {
            id: uuid(),
            name: 'John Doe',
            email: 'john.doe@gmail.com',
          },
        },
      },
    })

    const response = await request(app)
      .post(`/messages/${messageId}/preview`)
      .set('x-access-token', token)
      .send({
        email: 'john@doe.com',
      })

    expect(response.status).toBe(200)
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: {
          email: 'john@doe.com',
        },
        subject: 'My new message',
        body: 'This is a test message with long enough content.',
      })
    )
  })
})
