import { Content } from './content'

describe('Template content value object', () => {
  it('should accept valid subject', () => {
    const contentOrError = Content.create(
      'A message content with {{ message_content }} template variable'
    )

    expect(contentOrError.isRight()).toBeTruthy()
  })

  it('should reject subjects with less than 4 characters', () => {
    const contentOrError = Content.create('Content without template variable')

    expect(contentOrError.isLeft()).toBeTruthy()
  })

  it('should be able to compose the template content', () => {
    const content = Content.create(
      'A message content with {{ message_content }} template variable'
    ).value as Content

    const composed = content.compose('test')

    expect(composed).toEqual('A message content with test template variable')
  })
})
