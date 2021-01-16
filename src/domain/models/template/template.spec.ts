import { Template } from './template'

describe('Template model', () => {
  it('should be able to create new template', () => {
    const messageOrError = Template.create({
      title: 'A new template',
      content: 'A message content with {{ message_content }} template variable',
    })

    expect(messageOrError.isRight()).toBeTruthy()
  })

  it('should not be able to create new template with invalid title', () => {
    const messageOrError = Template.create({
      title: 'a',
      content: 'A message content with {{ message_content }} template variable',
    })

    expect(messageOrError.isLeft()).toBeTruthy()
  })

  it('should not be able to create new template with invalid content', () => {
    const messageOrError = Template.create({
      title: 'A new template',
      content: 'Content without template variable',
    })

    expect(messageOrError.isLeft()).toBeTruthy()
  })
})
