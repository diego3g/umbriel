import { InMemorySendersRepository } from '@modules/senders/repositories/in-memory/InMemorySendersRepository'

import { CreateSender } from './CreateSender'

let sendersRepository: InMemorySendersRepository
let createSender: CreateSender

describe('Create Sender', () => {
  beforeEach(async () => {
    sendersRepository = new InMemorySendersRepository()
    createSender = new CreateSender(sendersRepository)
  })

  it('should be able to create a new sender', async () => {
    const response = await createSender.execute({
      name: 'John Doe',
      email: 'john@doe.com',
    })

    expect(response.isRight()).toBe(true)
    expect(sendersRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        isValidated: false,
      })
    )
  })

  it('should not be able to create a sender with invalid name', async () => {
    const response = await createSender.execute({
      name: '',
      email: 'john@doe.com',
    })

    expect(response.isLeft()).toBe(true)
    expect(sendersRepository.items.length).toBe(0)
  })

  it('should not be able to create a sender with invalid e-mail', async () => {
    const response = await createSender.execute({
      name: 'John Doe',
      email: 'invalid',
    })

    expect(response.isLeft()).toBe(true)
    expect(sendersRepository.items.length).toBe(0)
  })
})
