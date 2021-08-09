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

  it('should filter GoogleImageProxy open events', async () => {
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
            email: 'johnsender2@example.com',
          },
        },
        tags: {
          create: {
            id: uuid(),
            tag: {
              create: {
                id: uuid(),
                title: 'New tag 02',
                subscribers: {
                  create: {
                    id: uuid(),
                    contact: {
                      create: {
                        id: contactId,
                        name: 'John doe',
                        email: 'johndoe2@example.com',
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
      eventType: 'Open',
      open: {
        ipAddress: '191.135.171.145',
        timestamp: '2021-08-03T22:59:04.831Z',
        userAgent:
          'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)',
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
    })

    expect(recipientInDatabase).toBeFalsy()
  })

  it('should store desired metadata on each notification type', async () => {
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
            email: 'johnsender3@example.com',
          },
        },
        tags: {
          create: {
            id: uuid(),
            tag: {
              create: {
                id: uuid(),
                title: 'New tag 03',
                subscribers: {
                  create: {
                    id: uuid(),
                    contact: {
                      create: {
                        id: contactId,
                        name: 'John doe',
                        email: 'johndoe3@example.com',
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

    await prisma.recipient.create({
      data: {
        id: uuid(),
        contact_id: contactId,
        message_id: messageId,
      },
    })

    const deliveryMessage = {
      eventType: 'Delivery',
      mail: { tags: { contactId: [contactId], messageId: [messageId] } },
      deliver: {
        timestamp: '2021-08-03T22:50:04.072Z',
        recipients: ['marcoaflg@hotmail.com'],
        reportingMTA: 'a48-78.smtp-out.amazonses.com',
        smtpResponse:
          '250 2.6.0 <0100017b0e35a8c6-2021949e-71e7-4802-aa95-ae62b696b836-000000@email.amazonses.com> [InternalId=95992519094146, Hostname=HE1EUR04HT112.eop-eur04.prod.protection.outlook.com] 13478 bytes in 0.277, 47.373 KB/sec Queued mail for delivery -> 250 2.1.5',
        processingTimeMillis: 1250,
      },
    }

    await request(app)
      .post(`/events/notifications`)
      .send({
        Type: 'Notification',
        Message: JSON.stringify(deliveryMessage),
      })

    const openMessage = {
      eventType: 'Open',
      mail: { tags: { contactId: [contactId], messageId: [messageId] } },
      open: {
        ipAddress: '191.135.171.145',
        timestamp: '2021-08-03T22:59:04.831Z',
        userAgent:
          'Microsoft Office/16.0 (Microsoft Outlook 16.0.13426; Pro), Mozilla/4.0 (compatible; ms-office; MSOffice 16)',
      },
    }

    await request(app)
      .post(`/events/notifications`)
      .send({
        Type: 'Notification',
        Message: JSON.stringify(openMessage),
      })

    const clickMessage = {
      eventType: 'Click',
      mail: { tags: { contactId: [contactId], messageId: [messageId] } },
      click: {
        link: 'https://www.youtube.com/watch?v=PmEDq--R6vA&ab_channel=Rocketseat',
        linkTags: null,
        ipAddress: '201.20.87.91',
        timestamp: '2021-08-05T13:21:06.409Z',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
      },
    }

    await request(app)
      .post(`/events/notifications`)
      .send({
        Type: 'Notification',
        Message: JSON.stringify(clickMessage),
      })

    const bounceMessage = {
      eventType: 'Bounce',
      mail: { tags: { contactId: [contactId], messageId: [messageId] } },
      bounce: {
        timestamp: '2021-08-03T22:50:01.805Z',
        bounceType: 'Permanent',
        feedbackId:
          '0100017b0e35a44c-10286004-c645-4b2b-979a-6af049c3d564-000000',
        reportingMTA: 'dns; a11-18.smtp-out.amazonses.com',
        bounceSubType: 'General',
        bouncedRecipients: [
          {
            action: 'failed',
            status: '5.1.1',
            emailAddress: 'Joao Paulo <joao@rocketseat.com.br>',
            diagnosticCode:
              'smtp; 550 5.1.1 <joao@rocketseat.com.br> User unknown',
          },
        ],
      },
    }

    await request(app)
      .post(`/events/notifications`)
      .send({
        Type: 'Notification',
        Message: JSON.stringify(bounceMessage),
      })

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

    expect(recipientInDatabase.events[0].meta).toEqual({})
    expect(recipientInDatabase.events[1].meta).toEqual({
      ipAddress: expect.any(String),
      userAgent: expect.any(String),
    })
    expect(recipientInDatabase.events[2].meta).toEqual({
      link: expect.any(String),
      linkTags: null,
      ipAddress: expect.any(String),
      userAgent: expect.any(String),
    })
    expect(recipientInDatabase.events[3].meta).toEqual({
      bounceType: expect.any(String),
      bounceSubType: expect.any(String),
      diagnosticCode: expect.any(String),
    })
  })
})
