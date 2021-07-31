import { CompareFieldsValidator } from './CompareFieldsValidator'

describe('Compare Fields Validator', () => {
  const validator = new CompareFieldsValidator('field', 'field_to_compare')

  it('should return no errors if receive both equal fields', () => {
    const err = validator.validate({ field: '1234', field_to_compare: '1234' })
    expect(err.isRight()).toBeTruthy()
  })

  it('should return an error if different fields', () => {
    const err = validator.validate({ field: '1234', field_to_compare: '4321' })
    expect(err.isLeft).toBeTruthy()
  })
})
