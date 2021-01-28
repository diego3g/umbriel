import { Email } from '../../domain/user/email'
import { Name } from '../../domain/user/name'
import { Password } from '../../domain/user/password'
import { User } from '../../domain/user/user'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError'
import { RegisterUser } from './RegisterUser'

let usersRepository: IUsersRepository
let registerUser: RegisterUser

describe('Register User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUser = new RegisterUser(usersRepository)
  })

  it('should be able to register new user', async () => {
    const response = await registerUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(await usersRepository.exists('john@doe.com')).toBeTruthy()
    expect(response.isRight()).toBeTruthy()
  })

  it('should not be able to register new user with invalid data', async () => {
    const response = await registerUser.execute({
      name: 'John Doe',
      email: 'john',
      password: '123',
    })

    expect(response.isLeft()).toBeTruthy()
  })

  it('should not be able to register new user with existing email', async () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email
    const password = Password.create('123456').value as Password

    const user = User.create({
      name,
      email,
      password,
    })

    usersRepository.create(user.value as User)

    const response = await registerUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(
      new AccountAlreadyExistsError('john@doe.com')
    )
  })
})
