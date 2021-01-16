import { Subject } from './subject'

describe('Message subject value object', () => {
  it('should accept valid subject', () => {
    const subjectOrError = Subject.create('An example subject')

    expect(subjectOrError.isRight()).toBeTruthy()
  })

  it('should reject subjects with less than 4 characters', () => {
    const subjectOrError = Subject.create('asd')

    expect(subjectOrError.isLeft()).toBeTruthy()
  })

  it('should reject subjects with more than 80 characters', () => {
    const subject = 'c'.repeat(81)
    const subjectOrError = Subject.create(subject)

    expect(subjectOrError.isLeft()).toBeTruthy()
  })
})
