import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { SearchTags } from './SearchTags'

type SearchTagsControllerRequest = {
  query?: string
  page?: string
  per_page?: string
}

export class SearchTagsController implements Controller {
  constructor(private searchTags: SearchTags) {}

  async handle({
    query,
    page,
    per_page,
  }: SearchTagsControllerRequest): Promise<HttpResponse> {
    try {
      const { data, totalCount } = await this.searchTags.execute({
        query,
        page: page ? Number(page) : undefined,
        perPage: per_page ? Number(per_page) : undefined,
      })

      return ok({
        data,
        totalCount,
      })
    } catch (err) {
      return fail(err)
    }
  }
}
