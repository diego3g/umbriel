import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { SearchContacts } from './SearchContacts'

type SearchContactsControllerRequest = {
  query?: string
  page?: string
  per_page?: string
}

export class SearchContactsController implements Controller {
  constructor(private searchContacts: SearchContacts) {}

  async handle({
    query,
    page,
    per_page,
  }: SearchContactsControllerRequest): Promise<HttpResponse> {
    try {
      const { data, totalCount } = await this.searchContacts.execute({
        query,
        page: page ? Number(page) : undefined,
        perPage: per_page ? Number(per_page) : undefined,
      })

      const contacts = data.map(contact => {
        return {
          id: contact.id,
          name: contact.name.value,
          email: contact.email.value,
          created_at: contact.createdAt,
        }
      })

      return ok({
        data: contacts,
        totalCount,
      })
    } catch (err) {
      return fail(err)
    }
  }
}
