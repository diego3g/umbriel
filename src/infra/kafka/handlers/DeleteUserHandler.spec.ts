/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { v4 as uuid } from 'uuid'

import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'

import { makeDeleteUserHandler } from '../factories/DeleteUserHandlerFactory'

const deleteUserHandler = makeDeleteUserHandler()

describe('Delete User Handler (Kafka)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to delete the user', async () => {
    await prisma.contact.create({
      data: {
        id: uuid(),
        name: 'John Doe',
        email: 'johndoe@example.com',
        integration_id: 'user-integration-id',
      },
    })

    await deleteUserHandler.handle({
      userId: 'user-integration-id',
    })

    const contactInDatabase = await prisma.contact.findUnique({
      where: {
        integration_id: 'user-integration-id',
      },
    })

    expect(contactInDatabase).toBeFalsy()
  })
})
