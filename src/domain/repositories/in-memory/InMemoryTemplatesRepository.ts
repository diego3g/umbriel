import { Template } from '../../models/template/template'
import { ITemplatesRepository } from '../ITemplatesRepository'

export class InMemoryTemplatesRepository implements ITemplatesRepository {
  constructor(public items: Template[] = []) {}

  async findById(id: string): Promise<Template> {
    return this.items.find(template => template.id === id)
  }

  async save(template: Template): Promise<void> {
    this.items.push(template)
  }
}
