import { User } from '../../models/user/user'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { InvalidEmailOrPasswordError } from './errors/InvalidEmailOrPasswordError'
import { AuthenticateUser } from './AuthenticateUser'

let usersRepository: IUsersRepository
let authenticateUser: AuthenticateUser

describe('Register user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUser = new AuthenticateUser(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    usersRepository.save(user.value as User)

    const response = await authenticateUser.execute({
      email: 'john@doe.com',
      password: '123456',
    })

    expect(response.value).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    )
    expect(response.isRight()).toBeTruthy()
  })

  it('should not be able to authenticate with invalid e-mail', async () => {
    const response = await authenticateUser.execute({
      email: 'invalid@example.com',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
  })

  it('should not be able to authenticate with invalid password', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    usersRepository.save(user.value as User)

    const response = await authenticateUser.execute({
      email: 'john@doe.com',
      password: 'invalid-password',
    })

    expect(response.isLeft()).toBeTruthy()
  })
})
