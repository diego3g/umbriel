/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { v4 as uuid } from 'uuid'

import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'

import { makeUpdateTeamTitleHandler } from '../factories/UpdateTeamTitleHandlerFactory'

const updateTeamTitleHandler = makeUpdateTeamTitleHandler()

describe('Update Team Title Handler (Kafka)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to update team title', async () => {
    await prisma.tag.create({
      data: {
        id: uuid(),
        title: 'Tag 01',
        integration_id: 'team-integration-id',
      },
    })

    await updateTeamTitleHandler.handle({
      team: {
        id: 'team-integration-id',
        title: 'Tag 02',
      },
    })

    const tagInDatabase = await prisma.tag.findUnique({
      where: {
        integration_id: 'team-integration-id',
      },
    })

    expect(tagInDatabase.title).toEqual('Tag 02')
  })
})
