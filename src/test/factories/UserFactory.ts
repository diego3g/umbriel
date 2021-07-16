import { Email } from '@modules/accounts/domain/user/email'
import { JWT } from '@modules/accounts/domain/user/jwt'
import { Name } from '@modules/accounts/domain/user/name'
import { Password } from '@modules/accounts/domain/user/password'
import { User } from '@modules/accounts/domain/user/user'

type UserOverrides = {
  email?: string
  password?: string
}

export function createUser(overrides?: UserOverrides) {
  const name = Name.create('John Doe').value as Name
  const email = Email.create(overrides?.email ?? 'john@doe.com').value as Email
  const password = Password.create(overrides?.password ?? '123456')
    .value as Password

  const user = User.create({
    name,
    email,
    password,
  })

  return user.value as User
}

export function createAndAuthenticateUser() {
  const name = Name.create('John Doe').value as Name
  const email = Email.create('johndoe@example.com').value as Email
  const password = Password.create('johndoe123').value as Password

  const user = User.create({
    name,
    email,
    password,
  }).value as User

  const jwt = JWT.signUser(user)

  return {
    user,
    jwt,
  }
}
