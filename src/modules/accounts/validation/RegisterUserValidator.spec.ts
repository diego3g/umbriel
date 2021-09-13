import { RegisterUserValidator } from './RegisterUserValidator'

describe('RegisterUser Validator', () => {
  const validator = new RegisterUserValidator()
  const params = {
    name: 'John Doe',
    email: 'johndoe@mail.com',
    password: 'pass123',
    password_confirmation: 'pass123',
  }

  it('should return no errors if receive all valid fields', () => {
    const err = validator.validate(params)
    expect(err.isRight()).toBeTruthy()
  })

  it('should return an error if receive wrong password confirmation', () => {
    const err = validator.validate({ ...params, password_confirmation: 'pass' })
    expect(err.isLeft()).toBeTruthy()
  })

  it('should return an error if any required field is missing', () => {
    const err = validator.validate({ ...params, name: null })
    expect(err.isLeft()).toBeTruthy()
  })

  it('should return an error if receive any invalid field', () => {
    let err = validator.validate({ ...params, name: 'c     ' })
    expect(err.isLeft()).toBeTruthy()

    err = validator.validate({ ...params, email: 'johndoe@mail' })
    expect(err.isLeft()).toBeTruthy()

    err = validator.validate({ ...params, name: 'j'.repeat(270) })
    expect(err.isLeft()).toBeTruthy()
  })
})
