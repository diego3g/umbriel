/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'

describe('Create Message (e2e)', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should be able to create new message', async () => {
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

    const response = await request(app)
      .post('/messages')
      .send({
        subject: 'The message subject',
        body: 'A message body with enough length',
        templateId: template.id,
        tags: [tag.id],
      })

    expect(response.status).toBe(201)

    const messageInDatabase = await prisma.message.findFirst({
      where: { subject: 'The message subject' },
    })

    expect(messageInDatabase).toBeTruthy()
  })
})
