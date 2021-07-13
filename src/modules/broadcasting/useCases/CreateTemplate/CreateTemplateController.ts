import { Controller } from '@core/infra/Controller'
import {
  HttpResponse,
  clientError,
  created,
  fail,
} from '@core/infra/HttpResponse'

import { CreateTemplate } from './CreateTemplate'

type CreateTemplateControllerRequest = {
  title: string
  content: string
}

export class CreateTemplateController implements Controller {
  constructor(private createTemplate: CreateTemplate) {}

  async handle({
    title,
    content,
  }: CreateTemplateControllerRequest): Promise<HttpResponse> {
    try {
      // TODO: Add validation

      const result = await this.createTemplate.execute({
        title,
        content,
      })

      if (result.isLeft()) {
        const error = result.value

        return clientError(error)
      } else {
        return created()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
