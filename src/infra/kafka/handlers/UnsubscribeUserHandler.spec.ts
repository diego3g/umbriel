/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { v4 as uuid } from 'uuid'

import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'

import { makeUnsubscribeUserHandler } from '../factories/UnsubscribeUserHandlerFactory'

const unsubscribeUserHandler = makeUnsubscribeUserHandler()

describe('Unsubscribe User Handler (Kafka)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to unsubscribe the user from a team', async () => {
    await prisma.contact.create({
      data: {
        id: uuid(),
        name: 'John Doe',
        email: 'johndoe@example.com',
        integration_id: 'user-integration-id',
        subscriptions: {
          create: {
            id: uuid(),
            tag: {
              create: {
                id: uuid(),
                title: 'Tag 01',
                integration_id: 'team-integration-id',
              },
            },
          },
        },
      },
    })

    await unsubscribeUserHandler.handle({
      userId: 'user-integration-id',
      teamsIds: ['team-integration-id'],
    })

    const contactInDatabase = await prisma.contact.findUnique({
      where: {
        integration_id: 'user-integration-id',
      },
      include: {
        subscriptions: {
          include: {
            tag: true,
          },
        },
      },
    })

    expect(contactInDatabase.integration_id).toEqual('user-integration-id')
    expect(contactInDatabase.subscriptions.length).toEqual(0)
  })
})
