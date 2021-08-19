import { Template } from '../domain/template/template'

export type TemplatesSearchParams = {
  query?: string
  page: number
  perPage: number
}

export type TemplatesSearchResult = {
  data: Template[]
  totalCount: number
}

export interface ITemplatesRepository {
  findAll(): Promise<Template[]>
  findById(id: string): Promise<Template>
  findDefaultTemplate(): Promise<Template>
  save(template: Template): Promise<void>
  create(template: Template): Promise<void>
  search(params: TemplatesSearchParams): Promise<TemplatesSearchResult>
}
