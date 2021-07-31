/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'

import { makeSubscribeUserHandler } from '../factories/SubscribeUserHandlerFactory'

const subscribeUserHandler = makeSubscribeUserHandler()

describe('Subscribe User Handler (Kafka)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to subscribe the user to a team', async () => {
    await subscribeUserHandler.handle({
      user: {
        id: 'user-integration-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      team: {
        id: 'team-integration-id',
        title: 'Custom team',
      },
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
    expect(contactInDatabase.subscriptions[0].tag.integration_id).toEqual(
      'team-integration-id'
    )
  })
})
