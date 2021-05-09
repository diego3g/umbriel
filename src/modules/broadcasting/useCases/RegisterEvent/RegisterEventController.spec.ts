/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'

import { validEventTypes } from '../../domain/event/type'

describe('Register Event (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to register event', async () => {
    const messageId = uuid()
    const contactId = uuid()

    await prisma.message.create({
      data: {
        id: messageId,
        subject: 'My new message',
        body: 'A message to be sent with a whole body',
        sender: {
          create: {
            id: uuid(),
            name: 'John Sender',
            email: 'johnsender@example.com',
          },
        },
        tags: {
          create: {
            id: uuid(),
            tag: {
              create: {
                id: uuid(),
                title: 'New tag',
                subscribers: {
                  create: {
                    id: uuid(),
                    contact: {
                      create: {
                        id: contactId,
                        name: 'John doe',
                        email: 'johndoe@example.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    const awsMessage = {
      eventType: 'Delivery',
      mail: {
        timestamp: '2016-10-19T23:20:52.240Z',
        source: 'johnsender@example.com',
        sourceArn:
          'arn:aws:ses:us-east-1:123456789012:identity/johnsender@example.com',
        sendingAccountId: '123456789012',
        messageId:
          'EXAMPLE7c191be45-e9aedb9a-02f9-4d12-a87d-dd0099a07f8a-000000',
        destination: ['johndoe@example.com'],
        headersTruncated: false,
        headers: [
          {
            name: 'From',
            value: 'johnsender@example.com',
          },
          {
            name: 'To',
            value: 'johndoe@example.com',
          },
          {
            name: 'Subject',
            value: 'Message sent from Amazon SES',
          },
          {
            name: 'MIME-Version',
            value: '1.0',
          },
          {
            name: 'Content-Type',
            value: 'text/html; charset=UTF-8',
          },
          {
            name: 'Content-Transfer-Encoding',
            value: '7bit',
          },
        ],
        commonHeaders: {
          from: ['sender@example.com'],
          to: ['recipient@example.com'],
          messageId:
            'EXAMPLE7c191be45-e9aedb9a-02f9-4d12-a87d-dd0099a07f8a-000000',
          subject: 'Message sent from Amazon SES',
        },
        tags: {
          'ses:configuration-set': ['ConfigSet'],
          'ses:source-ip': ['192.0.2.0'],
          'ses:from-domain': ['example.com'],
          'ses:caller-identity': ['ses_user'],
          'ses:outgoing-ip': ['192.0.2.0'],
          contactId: [contactId],
          messageId: [messageId],
        },
      },
      delivery: {
        timestamp: '2016-10-19T23:21:04.133Z',
        processingTimeMillis: 11893,
        recipients: ['johndoe@example.com'],
        smtpResponse: '250 2.6.0 Message received',
        reportingMTA: 'mta.example.com',
      },
    }

    const response = await request(app)
      .post(`/events/notifications`)
      .send({
        Type: 'Notification',
        Message: JSON.stringify(awsMessage),
      })

    expect(response.status).toBe(200)

    const recipientInDatabase = await prisma.recipient.findUnique({
      where: {
        message_id_contact_id: {
          contact_id: contactId,
          message_id: messageId,
        },
      },
      include: {
        events: true,
      },
    })

    expect(recipientInDatabase).toBeTruthy()
    expect(validEventTypes).toContain(recipientInDatabase.events[0].type)
  })
})
