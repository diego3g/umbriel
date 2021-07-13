import { Template } from '../domain/template/template'

export type TemplatesSearchParams = {
  query?: string
  page: number
  perPage: number
}

export interface ITemplatesRepository {
  findById(id: string): Promise<Template>
  save(template: Template): Promise<void>
  create(template: Template): Promise<void>
  search(params: TemplatesSearchParams): Promise<Template[]>
}
