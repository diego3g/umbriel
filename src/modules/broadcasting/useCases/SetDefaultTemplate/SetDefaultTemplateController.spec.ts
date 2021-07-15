/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'
import { createAndAuthenticateUser } from '@test/factories/UserFactory'

describe('Set Default Template (e2e)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to setdefaulttemplate', async () => {
    const {
      jwt: { token },
    } = createAndAuthenticateUser()

    const notDefaultTemplateId = uuid()

    await prisma.template.createMany({
      data: [
        {
          id: uuid(),
          title: 'Template title 1',
          content: 'Template content with {{ message_content }} variable.',
          is_default: true,
        },
        {
          id: notDefaultTemplateId,
          title: 'Template title 2',
          content: 'Template content with {{ message_content }} variable.',
          is_default: false,
        },
      ],
    })

    const response = await request(app)
      .patch(`/templates/${notDefaultTemplateId}/set-as-default`)
      .set('x-access-token', token)
      .send()

    expect(response.status).toBe(200)

    const defaultTemplates = await prisma.template.findMany({
      where: {
        is_default: true,
      },
    })

    expect(defaultTemplates.length).toBe(1)
    expect(defaultTemplates[0].id).toEqual(notDefaultTemplateId)
  })
})
