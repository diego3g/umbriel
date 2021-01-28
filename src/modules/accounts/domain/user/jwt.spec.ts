import { Email } from './email'
import { InvalidJWTTokenError } from './errors/InvalidJWTTokenError'
import { JWT, JWTTokenPayload } from './jwt'
import { Name } from './name'
import { Password } from './password'
import { User } from './user'

const name = Name.create('John Doe').value as Name
const email = Email.create('johndoe@example.com').value as Email
const password = Password.create('123456').value as Password

describe('JWT model', () => {
  it('should be able to create new user', () => {
    const userOrError = User.create({
      name,
      email,
      password,
    })

    const user = userOrError.value as User

    const jwt = JWT.signUser(user)

    expect(jwt.token).toEqual(expect.any(String))
  })

  it('should be able to initialize JWT from created token', () => {
    const userOrError = User.create({
      name,
      email,
      password,
    })

    const user = userOrError.value as User

    const createdJwt = JWT.signUser(user)

    const jwtOrError = JWT.createFromJWT(createdJwt.token)
    const jwt = jwtOrError.value as JWT

    expect(jwtOrError.isRight()).toBe(true)
    expect(jwt.userId).toBe(user.id)
  })

  it('should not be able to initialize JWT from invalid token', () => {
    const jwtOrError = JWT.createFromJWT('invalid-token')

    expect(jwtOrError.isLeft()).toBe(true)
    expect(jwtOrError.value).toEqual(new InvalidJWTTokenError())
  })

  it('should be able to decode JWT token', () => {
    const userOrError = User.create({
      name,
      email,
      password,
    })

    const user = userOrError.value as User

    const jwt = JWT.signUser(user)

    const decodedOrError = JWT.decodeToken(jwt.token)
    const decoded = decodedOrError.value as JWTTokenPayload

    expect(decodedOrError.isRight()).toBe(true)
    expect(decoded.sub).toBe(user.id)
    expect(decoded.exp).toEqual(expect.any(Number))
  })

  it('should not be able to decode invalid JWT token', () => {
    const jwtOrError = JWT.decodeToken('invalid-token')

    expect(jwtOrError.isLeft()).toBe(true)
    expect(jwtOrError.value).toEqual(new InvalidJWTTokenError())
  })
})
