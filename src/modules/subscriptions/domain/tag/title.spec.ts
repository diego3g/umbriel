import { Title } from './title'

describe('Template title value object', () => {
  it('should accept valid title', () => {
    const titleOrError = Title.create('An example title')

    expect(titleOrError.isRight()).toBeTruthy()
  })

  it('should reject titles with less than 4 characters', () => {
    const titleOrError = Title.create('asd')

    expect(titleOrError.isLeft()).toBeTruthy()
  })

  it('should reject titles with more than 250 characters', () => {
    const title = 'c'.repeat(251)
    const titleOrError = Title.create(title)

    expect(titleOrError.isLeft()).toBeTruthy()
  })
})
