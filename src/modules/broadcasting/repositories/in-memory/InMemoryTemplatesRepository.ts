import { Template } from '../../domain/template/template'
import {
  ITemplatesRepository,
  TemplatesSearchParams,
} from '../ITemplatesRepository'

export class InMemoryTemplatesRepository implements ITemplatesRepository {
  constructor(public items: Template[] = []) {}

  async findById(id: string): Promise<Template> {
    return this.items.find(template => template.id === id)
  }

  async save(template: Template): Promise<void> {
    const templateIndex = this.items.findIndex(
      findTemplate => findTemplate.id === template.id
    )

    this.items[templateIndex] = template
  }

  async create(template: Template): Promise<void> {
    this.items.push(template)
  }

  async search({
    query,
    page,
    perPage,
  }: TemplatesSearchParams): Promise<Template[]> {
    let tagList = this.items

    if (query) {
      tagList = this.items.filter(tag => tag.title.value.includes(query))
    }

    return tagList.slice((page - 1) * perPage, page * perPage)
  }
}
