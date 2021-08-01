import { Either, left, right } from '@core/logic/Either'
import { Content } from '@modules/broadcasting/domain/template/content'

type PreviewTemplateRequest = {
  html: string
}

type PreviewTemplateResponse = Either<Error, string>

export class PreviewTemplate {
  constructor() {}

  async execute({
    html,
  }: PreviewTemplateRequest): Promise<PreviewTemplateResponse> {
    const contentOrError = Content.create(html)

    if (contentOrError.isLeft()) {
      return left(contentOrError.value)
    }

    const previewContent = [
      '<p style="margin-bottom:1em">Hey there,</p>',
      '<p style="margin-bottom:1em">',
      'This is a sample of what content might look like in your course emails or',
      "broadcasts. You'll be able to use variables in the content of your",
      "messages to insert things like the subscriber's first name or email",
      'address, in addition to the variables that you use in this layout',
      'template.',
      '</p>',
      '<h1>This is an example heading</h1>',
      '<p style="margin-bottom:1em">',
      'Donec sed odio dui. Morbi leo risus, porta ac consectetur ac,',
      'vestibulum at eros. Sed posuere consectetur est at lobortis. Morbi leo',
      'risus, porta ac consectetur ac, vestibulum at eros.',
      '<a href="https://rocketseat.com.br" rel="noreferrer noopener" target="_blank">And this is a link</a>',
      '</p>',
      '<p style="margin-bottom:1em">',
      'Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit',
      'amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris',
      'condimentum nibh, ut fermentum massa justo sit amet risus. Donec',
      'ullamcorper nulla non metus auctor fringilla. Sed posuere consectetur',
      'est at lobortis. Donec ullamcorper nulla non metus auctor fringilla.',
      '</p>',
      '<p style="margin-bottom:1em">',
      'Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit',
      'libero, a pharetra augue. Donec sed odio dui. Vivamus sagittis lacus',
      'vel augue laoreet rutrum faucibus dolor auctor. Vivamus sagittis lacus',
      'vel augue laoreet rutrum faucibus dolor auctor.',
      '</p>',
      '<p style="margin-bottom:1em">- Your Name</p>',
    ]

    const content = contentOrError.value
    const preview = content.compose(previewContent.join('\n'))

    return right(preview)
  }
}
