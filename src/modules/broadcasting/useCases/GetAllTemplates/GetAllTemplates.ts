import { Template } from '@modules/broadcasting/domain/template/template'
import { ITemplatesRepository } from '@modules/broadcasting/repositories/ITemplatesRepository'

type GetAllTemplatesResponse = Template[]

export class GetAllTemplates {
  constructor(private templatesRepository: ITemplatesRepository) {}

  async execute(): Promise<GetAllTemplatesResponse> {
    const templates = this.templatesRepository.findAll()

    return templates
  }
}
