import { PreviewTemplate } from './PreviewTemplate'

let previewTemplate: PreviewTemplate

describe('Preview Template', () => {
  beforeEach(() => {
    previewTemplate = new PreviewTemplate()
  })

  it('should be able to preview template', async () => {
    const response = await previewTemplate.execute({
      html: '<h1>Message Title</h1>{{ message_content }}<p>Footer</p>',
    })

    const preview = response.value as string

    expect(response.isRight()).toBeTruthy()
    expect(preview.startsWith('<h1>Message Title</h1>')).toBe(true)
    expect(preview.endsWith('<p>Footer</p>')).toBe(true)
    expect(preview.includes('<h1>This is an example heading</h1>')).toBe(true)
  })
})
