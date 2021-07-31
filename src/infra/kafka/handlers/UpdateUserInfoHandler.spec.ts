/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { v4 as uuid } from 'uuid'

import { prisma } from '@infra/prisma/client'
import { redisConnection } from '@infra/redis/connection'

import { makeUpdateUserInfoHandler } from '../factories/UpdateUserInfoHandlerFactory'

const updateUserInfoHandler = makeUpdateUserInfoHandler()

describe('Update User Info Handler (Kafka)', () => {
  afterAll(async () => {
    redisConnection.disconnect()
    await prisma.$disconnect()
  })

  it('should be able to update user info', async () => {
    await prisma.contact.create({
      data: {
        id: uuid(),
        name: 'John Doe',
        email: 'johndoe@example.com',
        integration_id: 'user-integration-id',
      },
    })

    await updateUserInfoHandler.handle({
      user: {
        id: 'user-integration-id',
        name: 'John Doe 2',
        email: 'johndoe2@example.com',
      },
    })

    const contactInDatabase = await prisma.contact.findUnique({
      where: {
        integration_id: 'user-integration-id',
      },
    })

    expect(contactInDatabase.name).toEqual('John Doe 2')
    expect(contactInDatabase.email).toEqual('johndoe2@example.com')
  })
})
