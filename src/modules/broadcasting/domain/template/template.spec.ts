import { Content } from './content'
import { Template } from './template'
import { Title } from './title'

const title = Title.create('A new template').value as Title
const content = Content.create(
  'A message content with {{ message_content }} template variable'
).value as Content

describe('Template model', () => {
  it('should be able to create new template', () => {
    const templateOrError = Template.create({
      title,
      content,
    })

    expect(templateOrError.isRight()).toBeTruthy()
  })

  it('should be able to compose the template', () => {
    const template = Template.create({
      title,
      content,
    }).value as Template

    const composed = template.compose('test')

    expect(composed).toEqual('A message content with test template variable')
  })
})
