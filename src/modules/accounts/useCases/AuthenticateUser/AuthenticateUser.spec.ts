import { Email } from '../../domain/user/email'
import { Name } from '../../domain/user/name'
import { Password } from '../../domain/user/password'
import { User } from '../../domain/user/user'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { AuthenticateUser } from './AuthenticateUser'
import { InvalidEmailOrPasswordError } from './errors/InvalidEmailOrPasswordError'

let usersRepository: IUsersRepository
let authenticateUser: AuthenticateUser

const name = Name.create('John Doe').value as Name
const email = Email.create('john@doe.com').value as Email
const password = Password.create('123456').value as Password
describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUser = new AuthenticateUser(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const user = User.create({
      name,
      email,
      password,
    })

    usersRepository.create(user.value as User)

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
    expect(response.value).toEqual(new InvalidEmailOrPasswordError())
  })

  it('should not be able to authenticate with invalid password', async () => {
    const user = User.create({
      name,
      email,
      password,
    })

    usersRepository.create(user.value as User)

    const response = await authenticateUser.execute({
      email: 'john@doe.com',
      password: 'invalid-password',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidEmailOrPasswordError())
  })
})
