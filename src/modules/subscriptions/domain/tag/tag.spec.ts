import { Tag } from './tag'
import { Title } from './title'

describe('Tag model', () => {
  it('should be able to create new tag', () => {
    const title = Title.create('Tag 01').value as Title

    const messageOrError = Tag.create({
      title,
    })

    expect(messageOrError.isRight()).toBeTruthy()
  })
})
