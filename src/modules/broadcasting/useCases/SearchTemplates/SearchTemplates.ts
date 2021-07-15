import { Template } from '@modules/broadcasting/domain/template/template'
import { ITemplatesRepository } from '@modules/broadcasting/repositories/ITemplatesRepository'

type SearchTemplatesRequest = {
  query?: string
  page?: number
  perPage?: number
}

type SearchTemplatesResponse = {
  data: Template[]
  totalCount: number
}

export class SearchTemplates {
  constructor(private templatesRepository: ITemplatesRepository) {}

  async execute({
    query,
    page = 1,
    perPage = 20,
  }: SearchTemplatesRequest): Promise<SearchTemplatesResponse> {
    const { data, totalCount } = await this.templatesRepository.search({
      query,
      page,
      perPage,
    })

    return {
      data,
      totalCount,
    }
  }
}
