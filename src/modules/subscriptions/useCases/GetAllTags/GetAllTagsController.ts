import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { GetAllTags } from './GetAllTags'

export class GetAllTagsController implements Controller {
  constructor(private getAllTags: GetAllTags) {}

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.getAllTags.execute()

      const tags = result.map(tag => {
        return {
          id: tag.id,
          title: tag.title.value,
        }
      })

      return ok({ data: tags })
    } catch (err) {
      return fail(err)
    }
  }
}
