import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { PreviewTemplate } from './PreviewTemplate'

type PreviewTemplateControllerRequest = {
  html: string
}

export class PreviewTemplateController implements Controller {
  constructor(private previewTemplate: PreviewTemplate) {}

  async handle({
    html,
  }: PreviewTemplateControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.previewTemplate.execute({
        html,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return clientError(error)
        }
      } else {
        return ok({
          preview: result.value,
        })
      }
    } catch (err) {
      return fail(err)
    }
  }
}
