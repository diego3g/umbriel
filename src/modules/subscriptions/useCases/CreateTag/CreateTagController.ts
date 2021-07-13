import { Controller } from '@core/infra/Controller'
import {
  HttpResponse,
  fail,
  clientError,
  created,
} from '@core/infra/HttpResponse'

import { CreateTag } from './CreateTag'

type CreateTagControllerRequest = {
  title: string
}

export class CreateTagController implements Controller {
  constructor(private createTag: CreateTag) {}

  async handle({ title }: CreateTagControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.createTag.execute({
        title,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return clientError(error)
        }
      } else {
        return created()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
