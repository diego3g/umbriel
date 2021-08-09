import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { GetAllTemplates } from './GetAllTemplates'

export class GetAllTemplatesController implements Controller {
  constructor(private getAllTemplates: GetAllTemplates) {}

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.getAllTemplates.execute()

      const templates = result.map(template => {
        return {
          id: template.id,
          title: template.title.value,
        }
      })

      return ok({ data: templates })
    } catch (err) {
      return fail(err)
    }
  }
}
