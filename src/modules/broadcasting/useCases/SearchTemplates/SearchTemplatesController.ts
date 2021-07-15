import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { SearchTemplates } from './SearchTemplates'

type SearchTemplatesControllerRequest = {
  query?: string
  page?: string
  per_page?: string
}

export class SearchTemplatesController implements Controller {
  constructor(private searchTemplates: SearchTemplates) {}

  async handle({
    query,
    page,
    per_page,
  }: SearchTemplatesControllerRequest): Promise<HttpResponse> {
    try {
      const { data, totalCount } = await this.searchTemplates.execute({
        query,
        page: page ? Number(page) : undefined,
        perPage: per_page ? Number(per_page) : undefined,
      })

      const templates = data.map(template => {
        return {
          id: template.id,
          title: template.title.value,
          isDefault: template.isDefault,
        }
      })

      return ok({
        data: templates,
        totalCount,
      })
    } catch (err) {
      return fail(err)
    }
  }
}
