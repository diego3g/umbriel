import { Template } from '../domain/template/template'

export interface ITemplatesRepository {
  items: Template[]
  findById(id: string): Promise<Template>
  save(template: Template): Promise<void>
  create(template: Template): Promise<void>
}
