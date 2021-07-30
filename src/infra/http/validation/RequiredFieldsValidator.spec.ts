import { RequiredFieldsValidator } from './RequiredFieldsValidator'

describe('Required Fields Validator', () => {
  interface RequiredFields {
    field1: string
    field2: number
    field3: boolean
  }
  const validator = new RequiredFieldsValidator<RequiredFields>()

  it('should return no errors if receive all required fields', () => {
    const err = validator.validate({
      field1: 'lorem ipsum',
      field2: 3,
      field3: false,
    })
    expect(err.isRight()).toBeTruthy()
  })

  it('should return an error if any required fields are missing', () => {
    const err = validator.validate({
      field1: undefined,
      field2: 3,
      field3: false,
    })
    expect(err.isLeft()).toBeTruthy()
  })
})
