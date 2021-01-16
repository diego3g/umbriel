import { Template } from '../models/template/template'

export interface ITemplatesRepository {
  items: Template[]
  findById(id: string): Promise<Template>
  save(template: Template): Promise<void>
}
