import { Template } from '../../domain/template/template'
import {
  ITemplatesRepository,
  TemplatesSearchParams,
  TemplatesSearchResult,
} from '../ITemplatesRepository'

export class InMemoryTemplatesRepository implements ITemplatesRepository {
  constructor(public items: Template[] = []) {}

  async findAll(): Promise<Template[]> {
    return this.items
  }

  async findById(id: string): Promise<Template> {
    return this.items.find(template => template.id === id)
  }

  async findDefaultTemplate(): Promise<Template> {
    return this.items.find(template => template.isDefault === true)
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
  }: TemplatesSearchParams): Promise<TemplatesSearchResult> {
    let tagList = this.items

    if (query) {
      tagList = this.items.filter(tag => {
        const search = new RegExp(query, 'i')
        return search.test(tag.title.value)
      })
    }

    return {
      data: tagList.slice((page - 1) * perPage, page * perPage),
      totalCount: tagList.length,
    }
  }
}
