import { Tag } from './tag'

describe('Tag model', () => {
  it('should be able to create new tag', () => {
    const messageOrError = Tag.create({
      title: 'A new tag',
    })

    expect(messageOrError.isRight()).toBeTruthy()
  })

  it('should not be able to create new template with invalid title', () => {
    const messageOrError = Tag.create({
      title: 'a',
    })

    expect(messageOrError.isLeft()).toBeTruthy()
  })
})
